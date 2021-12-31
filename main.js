/*
 * @Author: Mukti
 * @Date: 2021-12-31 15:24:31
 * @LastEditTime: 2021-12-31 23:36:11
 * @LastEditors: Mukti
 */
const { app, BrowserWindow } = require('electron');
const process = require('process');
const path = require('path');
// const httpServer = require('http-server');
const WebSocketServer = require('ws').Server;
const printer = require('printer');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
  });
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.dock.setIcon('./icon.png');

// httpServer.createServer().listen(8080);

const ws = new WebSocketServer({port: 13528});
const wss = new WebSocketServer({port: 13529});
ws.on('connection', (ws) => {
  console.log('Client connected.');
  // ws.on('open', function open() {
  //   ws.send('something');
  // });
  ws.on('message', (msg) => {
    let data = {};
    try {
      data = JSON.parse(msg.toString());
    } catch {
      ws.send('Error');
    }
    console.log(data);
    if (data.cmd === 'getPrinters') {
      let printerList = printer.getPrinters();
      ws.send(JSON.stringify(printerList));
    } else {
      ws.send('Wrong cmd.');
    }
  });
});