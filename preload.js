/*
 * @Author: Mukti
 * @Date: 2021-12-31 16:55:22
 * @LastEditTime: 2023-09-20 20:40:02
 * @LastEditors: Mukti
 */
const process = require('process');
const { contextBridge, ipcRenderer, dialog } = require('electron');

// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector);
//     if (element) element.innerText = text;
//   };

//   for (const dependency of ['chrome', 'node', 'electron']) {
//     replaceText(`${dependency}-version`, process.versions[dependency]);
//   }
// });

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld('methods', {
  // 通过 setTitle 方法，将 ipcRenderer.send 方法暴露给渲染进程，并定义一个名为 set-title 的 channel 供主进程监听
  setTitle: (title) => ipcRenderer.send('set-title', title),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),
  showOpenDialog: () => ipcRenderer.invoke('dialog:showOpenDialog'),
  showSaveDialog: () => ipcRenderer.invoke('dialog:showSaveDialog'),
  showMessageBox: () => ipcRenderer.invoke('dialog:showMessageBox'),
  showOpenDialogSync: () => ipcRenderer.invoke('dialog:showOpenDialogSync'),
  showSaveDialogSync: () => ipcRenderer.invoke('dialog:showSaveDialogSync'),
});
