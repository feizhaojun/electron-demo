/*
 * @Author: Mukti
 * @Date: 2023-08-07 19:24:38
 * @LastEditTime: 2024-01-02 15:41:35
 * @LastEditors: Mukti
 */
const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron');
const process = require('process');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // eslint-disable-next-line no-undef
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => win.webContents.send('update-counter', -1),
          label: 'Decrement'
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  win.loadFile('index.html');
  win.webContents.openDevTools();
};

const handleSetTitle = (event, title) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
};
const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    return filePaths[0];
  }
};
const showOpenDialog = async () => {
  const res = await dialog.showOpenDialog({
    title: 'Title Test',
    buttonLabel: '哈哈哈',
    properties: [ 'openDirectory', 'createDirectory' ]
  });
  console.log(res);
};
const showSaveDialog = async () => {
  const res = await dialog.showSaveDialog({
    title: 'Title Test',
    buttonLabel: '哈哈',
    message: 'dfs mesg',
    nameFieldLabel: 'nameFieldLabel',
    showsTagField: true,
    properties: [ 'openDirectory', 'createDirectory' ]
  });
  console.log(res);
};
const showMessageBox = async () => {
  const res = await dialog.showMessageBox();
  console.log(res);
};
const showOpenDialogSync = async () => {
  const res = dialog.showOpenDialogSync({
    title: 'Title Test',
    buttonLabel: '哈哈哈',
    properties: [ 'openDirectory', 'createDirectory' ]
  });
  console.log(res);
};
const showSaveDialogSync = async () => {
  const res = await dialog.showSaveDialogSync();
  console.log(res);
};

app.whenReady().then(() => {
  // 监听 ipc 消息
  ipcMain.on('set-title', handleSetTitle);
  // 监听回复
  ipcMain.on('counter-value', (_event, value) => {
    console.log(value);
  });
  // 双向 ipc，从渲染器进程代码调用主进程模块并等待结果 
  ipcMain.handle('dialog:openFile', handleFileOpen);
  ipcMain.handle('ping', () => 'ping msg');
  ipcMain.handle('dialog:showOpenDialog', showOpenDialog);
  ipcMain.handle('dialog:showSaveDialog', showSaveDialog);
  ipcMain.handle('dialog:showMessageBox', showMessageBox);
  ipcMain.handle('dialog:showOpenDialogSync', showOpenDialogSync);
  ipcMain.handle('dialog:showSaveDialogSync', showSaveDialogSync);
  // 
  // 
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


app.setAsDefaultProtocolClient('mf', process.execPath, 'args');