// ==UserScript==
// @name         All sites - #stylizing
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @match        *://*/*
// @description  things like border color for document.body
// @noframes
// @require      https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/.libraries/All%20sites%20-%20.fixed%20title.js
// @downloadURL  https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/All%20sites%20-%20%23stylizing.js
// @updateURL    https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/All%20sites%20-%20%23stylizing.js
// ==/UserScript==
//const CSS_COLOR_NAMES = ['red', 'blue', 'yellow', 'green', 'pink', 'orange', 'indigo', 'violet', 'navy', 'aqua', 'MAROON', 'purple'];
//document.body.style.border = '4px dashed ' + CSS_COLOR_NAMES[Math.floor(Math.random() * CSS_COLOR_NAMES.length)];

if (window.location.hostname === "exhentai.org") {
    let [navTop, navBot] = [document.querySelector('table.ptt'), document.querySelector('table.ptb')];
    [navTop, navBot].forEach(nav => {
        nav.style.width = '1000px';
        nav.style.height = '120px';
        nav.style.fontSize = '30px';
    })
}