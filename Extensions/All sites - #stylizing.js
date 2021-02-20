// ==UserScript==
// @name         All sites - #stylizing
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @match        *://*/*
// @description  things like border color for document.body
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/.libraries/All%20sites%20-%20.fixed%20title.js
// @downloadURL  https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/All%20sites%20-%20%23stylizing.js
// @updateURL    https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/All%20sites%20-%20%23stylizing.js
// ==/UserScript==
//const CSS_COLOR_NAMES = ['red', 'blue', 'yellow', 'green', 'pink', 'orange', 'indigo', 'violet', 'navy', 'aqua', 'MAROON', 'purple'];
const CSS_COLOR_NAMES = ['red', 'blue', 'yellow', 'green', 'pink', 'orange', 'indigo', 'violet', 'navy', 'aqua', 'MAROON', 'purple']
const styles = {}
styles.debug = 'color: blue';
styles.log = 'color:green';

colorizeVerticalBorders(document.body);
alertNewVersion();
if (window.location.hostname === "exhentai.org") {
    const [navTop, navBot] = [document.querySelector('table.ptt'), document.querySelector('table.ptb')];
    [navTop, navBot].forEach(nav => {
        nav.style.width = '900px';
        nav.style.height = '120px';
        nav.style.fontSize = '30px';
    })
}
function alertNewVersion() {
    const currentVersion = GM_getValue('scriptVersion') || '0';
    const latestVersion = GM_info.script.version; 
    if (latestVersion > currentVersion){
        GM_setValue('scriptVersion',latestVersion);
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