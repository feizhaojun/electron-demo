/*
 * @Author: Mukti
 * @Date: 2021-12-31 16:55:22
 * @LastEditTime: 2021-12-31 18:27:25
 * @LastEditors: Mukti
 */
const process = require('process');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    // replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});