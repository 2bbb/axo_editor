const path = require('path');
const fs = require('fs');

const electron = require('electron');
const { app, remote, dialog, ipcMain } = electron;
const { BrowserWindow } = electron;
const { Menu } = electron;

let window;
function createWindow() {
    if(window) {
        window.open();
        return;
    }
    window = new BrowserWindow({ width: 1280, height: 1024 });
    window.loadURL(`file://${__dirname}/index.html#misc`);
    // window.webContents.openDevTools();
    window.on('closed', () => {
        // win = null;
    });
}

app.on('ready', () => {
    createWindow();
    createMenu();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (window === null) {
        createWindow();
    }
});

const FileContext = require('./modules/FileContext.js');
let fileContext = null;
const editor_ids = require('./modules/CodeIds.js');

function ipcsend(key, obj) {
    if(window) window.webContents.send(key, obj);
}

const open = () => {
    if(!window) {
        createWindow;
    }
    const options = {
        title: 'open axo',
        filters: [{ name: 'Axoloti Object', extensions: ['axo'] }],
        properties: ['openFile'],
    };
    dialog.showOpenDialog(window, options, (filePaths) => {
        if(!filePaths) return;
        fileContext = new FileContext(filePaths[0]).load((err, context) => {
            if(err) return console.error(err);
            ipcsend('file/name', context.path);
            ipcsend('file/opened', context.editables);
        });
    });
}

const saveAs = (impl) => {
    const options = {
        title: 'save axo',
        filters: [{ name: 'Axoloti Object', extensions: ['axo'] }],
    };
    dialog.showSaveDialog(window, options, (filePath) => {
        if(!filePath) return;
        if(!fileContext) fileContext = new FileContext();
        fileContext.path = filePath;
        impl();
    });
};

const save = () => {
    const listener = (event, editables) => {
        ipcMain.removeListener('file/will_save/response', listener);
        fileContext.save(editables, (err) => {
            if(err) return console.log(err);
            console.log('saved!!');
        });
    };
    const impl = () => {
        ipcMain.on('file/will_save/response', listener);
        ipcsend('file/will_save');
    };
    if(!fileContext || !fileContext.path) return saveAs(impl);
    if(fileContext && fileContext.path) impl();
}

function createMenu() {
    const submenu = (label, click, accelerator) => ({label, click, accelerator});
    const separator = () => ({ type: 'separator' });
    const role = (r) => ({ role: r });
    const template = [
        {
            label: 'File',
            submenu: [
                submenu('New File', () => { console.log('new'); }, 'CmdOrCtrl+N'),
                separator(),
                submenu('Open', open, 'CmdOrCtrl+O'),
                submenu('Save', save, 'CmdOrCtrl+S'),
                submenu('Save As...', saveAs, 'Shift+CmdOrCtrl+S'),
                separator(),
                submenu('Reload', () => { console.log('reload'); }, 'CmdOrCtrl+R'),
            ]
        },
        {
            label: 'Edit',
            submenu: [
                submenu('Copy', () => {},'CmdOrCtrl+C'),
                submenu('Paste', () => {}, 'CmdOrCtrl+V'),
            ]
        },
        {
            label: 'Help',
            submenu: [
                { label: 'About', role: 'about' }
            ]
        },
    ];
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                role('about'),
                separator(),
                { role: 'services', submenu: [] },
                separator(),
                role('hide'),
                role('hideothers'),
                role('unhide'),
                separator(),
                role('quit')
            ]
        })
    }
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}
