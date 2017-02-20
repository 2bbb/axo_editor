const electron = require('electron');
const { remote } = electron;
const { app, BrowserWindow, dialog } = remote;
const ipc = electron.ipcRenderer;

const misc_ids = require('./modules/MiscIds.js');
const definition_ids = require('./modules/DefinitionIds.js');
const code_ids = require('./modules/CodeIds.js');

const editors = {};
function onModuleLoaded() {
    code_ids.forEach(id => {
        editors[id] = monaco.editor.create(document.getElementById(id).getElementsByTagName('div')[0], {
            value: '',
            language: 'cpp',
            automaticLayout: true,
            theme: "vs-dark",
        });
    });
    definition_ids.forEach(id => {
        editors[id] = monaco.editor.create(document.getElementById(id).getElementsByTagName('div')[0], {
            value: '',
            language: 'xml',
            automaticLayout: true,
            theme: "vs-dark",
            wrappingColumn: 0
        });
    });
}

ipc.on('file/name', (evt, name) => {
    document.getElementsByTagName('title')[0].innerText = `axo editor: ${name}`;
});

ipc.on('file/opened', (evt, editables) => {
    console.log(editables);
    document.getElementById('id').value = editables.miscs.id;
    document.getElementById('uuid').value = editables.miscs.uuid;
    misc_ids.forEach(id => { document.getElementById(id).value = editables.miscs[id]; });
    definition_ids.forEach(id => editors[id].setValue(editables.definitions[id]));
    code_ids.forEach(id => editors[id].setValue(editables.codes[id]));
});

ipc.on('file/will_save', () => {
    console.log('file/will_save');
    const miscs = {
        id: document.getElementById('id').value,
        uuid: document.getElementById('uuid').value,
    };

    misc_ids.forEach(id => { miscs[id] = document.getElementById(id).value; });

    const definitions = definition_ids.reduce((obj, id) => {
        obj[id] = editors[id].getValue();
        return obj;
    }, {});

    const codes = code_ids.reduce((obj, id) => {
        obj[id] = editors[id].getValue();
        return obj;
    }, {});

    const editables = { miscs, definitions, codes };
    ipc.send('file/will_save/response', editables);
});

function showEditorText() {
    var text = editor.getValue();
    alert(text);
}
