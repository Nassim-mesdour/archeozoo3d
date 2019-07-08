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
    mainWindow.on("closed",function(){
        mainWindow = null;
    })
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })


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
                label : 'Nouveau Projet',
                click(){
                    // const {shell} = require('electron') // deconstructing assignment

                    // shell.openItem('filepath')
                    // shell.openItem('folderpath')
                    var filePath = __dirname;
                    electron.dialog.showOpenDialog({
                    properties:['openFile'],
                    filters:[
                        {name:'Log', extentions:['csv', 'log']}
                    ]
                    });
                }
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