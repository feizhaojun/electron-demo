/*
 * @Author: Mukti
 * @Date: 2021-12-31 16:59:30
 * @LastEditTime: 2023-09-20 20:49:59
 * @LastEditors: Mukti
 */

const ipcMsg = async () => {
  const response = await (window).versions.ping();
  console.log(response); // 打印 'pong'
  document.getElementById('msg').innerHTML = response;
};

ipcMsg();

document.getElementById('set-title').addEventListener('click', () => {
  window.methods.setTitle('Mukti Title');
});

document.getElementById('open-file').addEventListener('click', async () => {
  const res = await window.methods.openFile();
  document.getElementById('msg').innerHTML = res;
});

let counter = 0;
window.methods.onUpdateCounter((e, value) => {
  counter += value;
  document.getElementById('msg').innerHTML = counter;
  // 回复给主进程
  event.sender.send('counter-value', counter);
});

// MessagePot

const channel = new MessageChannel();

// const port1 = channel.port1;
const port2 = channel.port2;

port2.postMessage({ answer: 42 });

// ipcRenderer.postMessage('port', null, [port1]);


// 打开对话框 dialog

document.getElementById('showOpenDialog').addEventListener('click', async () => {
  console.log('showOpenDialog');
  const res = await window.methods.showOpenDialog();
  document.getElementById('msg').innerHTML = res;
});

document.getElementById('showSaveDialog').addEventListener('click', async () => {
  const res = await window.methods.showSaveDialog();
  document.getElementById('msg').innerHTML = res;
});

document.getElementById('showMessageBox').addEventListener('click', async () => {
  const res = await window.methods.showMessageBox();
  document.getElementById('msg').innerHTML = res;
});

document.getElementById('showOpenDialogSync').addEventListener('click', async () => {
  const res = await window.methods.showOpenDialogSync();
  document.getElementById('msg').innerHTML = res;
});

document.getElementById('showSaveDialogSync').addEventListener('click', async () => {
  const res = await window.methods.showSaveDialogSync();
  document.getElementById('msg').innerHTML = res;
});