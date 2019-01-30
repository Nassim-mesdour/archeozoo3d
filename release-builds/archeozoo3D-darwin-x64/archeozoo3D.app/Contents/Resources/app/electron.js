const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

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
});