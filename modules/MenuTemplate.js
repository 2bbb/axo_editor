const submenu = (label, click, accelerator) => ({label, click, accelerator});
const separator = () => ({ type: 'separator' });

const template = [
    {
        label: 'File',
        submenu: [
            submenu('New File', () => { console.log('new'); }, 'CmdOrCtrl+N'),
            separator(),
            submenu('Open', open, 'Cmd+Ctrl+O'),
            submenu('Save', save, 'CmdOrCtrl+S'),
            submenu('Save As...', () => { console.log('save as'); }, 'Shift+CmdOrCtrl+S'),
            // separator(),
            // submenu('Reload', () => { console.log('reload'); }, 'CmdOrCtrl+R'),
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

// if (process.platform === 'darwin') {
//     template.unshift({
//         label: app.getName(),
//         submenu: [
//             {
//                 role: 'about'
//             },
//             separator(),
//             {
//                 role: 'services',
//                 submenu: []
//             },
//             separator(),
//             {
//                 role: 'hide'
//             },
//             {
//                 role: 'hideothers'
//             },
//             {
//                 role: 'unhide'
//             },
//             separator(),
//             {
//                 role: 'quit'
//             }
//         ]
//     })
//     // Edit menu.
//     template[1].submenu.push(
//         separator(),
//         {
//             label: 'Speech',
//             submenu: [
//                 {
//                     role: 'startspeaking'
//                 },
//                 {
//                     role: 'stopspeaking'
//                 }
//             ]
//         }
//     )
//     // Window menu.
//     template[3].submenu = [
//         {
//             label: 'Close',
//             accelerator: 'CmdOrCtrl+W',
//             role: 'close'
//         },
//         {
//             label: 'Minimize',
//             accelerator: 'CmdOrCtrl+M',
//             role: 'minimize'
//         },
//         {
//             label: 'Zoom',
//             role: 'zoom'
//         },
//         separator(),
//         {
//             label: 'Bring All to Front',
//             role: 'front'
//         }
//     ]
// }

module.exports = template;