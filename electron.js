const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;


//listen in window open
app.on('ready',function(){
//create new window
    mainWindow = new BrowserWindow({});
//load HTML into newWindow
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname,'./index.html'),
        protocol : 'file',
        slashes : true,
    }));

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});


// add menu top bar // -------------------------
const menuTemplate = [
    {
        label: 'Archeozoo3D',
        submenu : [
            {
                label : 'à propos de Archeozoo3D'
            },
            {
                label : 'Quitter Archeozoo3D',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Fichier',
        submenu : [
            {
                label : 'Nouveau Projet'
            },
            {
                label : 'Nouvelle fenêtre'
            }
        ]
    }
]

// add devtools for Html, Css and Js

if(process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
        label : 'DevTools',
        submenu : [
            {
                label : 'Open DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role : 'reload'
            }
        ]
    })
}