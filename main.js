/*
 * @Author: Mukti
 * @Date: 2021-12-31 15:24:31
 * @LastEditTime: 2022-01-05 23:58:38
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

app.dock.setIcon(path.join(__dirname, 'icon.png'));

// httpServer.createServer().listen(8080);

const cainiaoWs = new WebSocketServer({port: 13528});
const cainiaoWss = new WebSocketServer({port: 13529});
const pinduoduoWs = new WebSocketServer({port: 5000});
const pinduoduoWss = new WebSocketServer({port: 18653});
const doudianWs = new WebSocketServer({port: 13888});
const doudianWss = new WebSocketServer({port: 13999});
cainiaoWs.on('connection', init);
cainiaoWss.on('connection', init);
pinduoduoWs.on('connection', init);
pinduoduoWss.on('connection', init);
doudianWs.on('connection', init);
doudianWss.on('connection', init);

function init(ws) {
  ws.on('message', (msg) => {
    let data = {};
    try {
      data = JSON.parse(msg.toString());
    } catch {
      ws.send('Error');
    }
    response(data, ws);
  });
}

// 响应主逻辑
function response(data, ws) {
  let res = {
    cmd: data.cmd,
    requestID: data.requestID,
  };
  let printers = printer.getPrinters();
  switch(data.cmd) {
  case 'getPrinters':
    res.printers = printers.map(el => {
      if (el.isDefault) {
        res.defaultPrinter = el.name;
      }
      return {
        name: el.name
      };
    });
    break;
  case 'getPrinterConfig':
    res.status = 'success';
    res.msg = '';
    // TODO:
    res.printer = {
      name: '打印机名称',
      needTopLogo: false,
      needBottomLogo: false,
      horizontalOffset: 1,
      verticalOffset: 2,
      forceNoPageMargins: true,
      autoPageSize: false,
      orientation: 0,
      autoOrientation: false,
      paperSize: {
        width: 100,
        height: 180
      }
    };
    ws.send(JSON.stringify(res));
    break;
  case 'setPrinterConfig':
    res.status = 'success';
    res.msg = '';
    break;
  case 'print':
    res.status = 'success';
    res.taskID = data.taskID;
    if (data.preview) {
      if (data.previewType === 'image') {
        res.previewImage = [];
      } else {
        res.previewURL = '';
      }
    }
    // 随机一个时间之后返回打印通知
    // eslint-disable-next-line no-case-declarations
    let notifyTime = Math.random() * 600 + 200;
    setTimeout(() => {
      ws.send(JSON.stringify({
        cmd: 'notifyPrintResult',
        printer: data.printer,
        taskID: data.taskID,
        taskStatus: 'printed',
        printStatus: data.task.documents.map(el => {
          return {
            documentID: el.documentID,
            status: 'success',
            msg: '',
            detail: ''
          };
        })
      }));
    }, notifyTime);
    break;
  case 'getTaskStatus':
    res.printStatus = data.taskID.map(() => {
      return {
        documentID: '',
        status: 'success',
        msg: '',
        printer: ''
      };
    });
    break;
  case 'getGlobalConfig':
    res.status = 'success';
    res.msg = '';
    res.notifyOnTaskFailure = false;
    break;
  case 'setGlobalConfig':
    res.status = 'success';
    res.msg = '';
    break;
  case 'getAgentInfo':
    res.status = 'success';
    res.msg = '';
    res.version = '1.0.0';
    break;
  }
  ws.send(JSON.stringify(res));
}