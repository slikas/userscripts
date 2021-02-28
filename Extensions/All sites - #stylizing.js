// ==UserScript==
// @name         All sites - #stylizing
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @match        *://*/*
// @description  things like border color for document.body
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @require      https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/.libraries/All%20sites%20-%20.fixed%20title.js
// @require      https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/.libraries/All%20sites%20-%20.hightlight%20sites%20with%20comments.js
// @downloadURL  https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/All%20sites%20-%20%23stylizing.js
// @updateURL    https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/All%20sites%20-%20%23stylizing.js
// ==/UserScript==
const CSS_COLOR_NAMES = ['red', 'blue', 'yellow', 'green', 'pink', 'orange', 'indigo', 'violet', 'navy', 'aqua', 'MAROON', 'purple']
const styles = {};
styles.debug = 'color: blue';
styles.log = 'color:green';
console.debug('%c#userscript: %s', styles.debug, GM_info.script.name);
colorizeVerticalBorders(document.body);
alertNewVersion();
const hostname = window.location.hostname;
const elementsToHide = {};
[elementsToHide.mobile, elementsToHide.desktop] = [[], []];
switch (hostname) {
    case "exhentai.org": {
        GM_addStyle(`
            table.ptt, table.ptb {
                width: 900px;
                height: 120px;
                font-size: 30px;
            }
        `)
        break;
    }
    case "voz.vn": {
        break;
    }
    case "vnexpress.net": {
        elementsToHide.mobile = ['#footer', '#same_category'];
        elementsToHide.desktop = ['.footer', '.box-category__list-news'];
        break;
    }
    case 'songmeanings.com': {
        elementsToHide.desktop = ['#sidebar', '#footer', '#content>div:last-child',
            '.main-holder>div:first-child', '.holder.sign-box', '.login', '#header>:nth-child(2)',
            '.block-heading', '.login-holder', 'a[href="#addcomment"]' ,'.holder.lyric-box>div:last-of-type'
        ];
        break;
    }
}
GM_addStyle((elementsToHide.mobile.concat(elementsToHide.desktop)).join() + '{display:none}');

function alertNewVersion() {
    const currentVersion = GM_getValue('scriptVersion') || '0';
    const latestVersion = GM_info.script.version;
    if (latestVersion > currentVersion) {
        GM_setValue('scriptVersion', latestVersion);
        alert('Script: ' + GM_info.script.name +
            '\nNew version: ' + latestVersion);
    }
}

function getFuncName() {
    return getFuncName.caller.name
}
function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
}
function colorizeVerticalBorders(block) {
    block.style.border = '4px dashed ' + CSS_COLOR_NAMES[Math.floor(Math.random() * CSS_COLOR_NAMES.length)];
}