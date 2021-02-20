// ==UserScript==
// @name         voz.vn - #main
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @match        https://voz.vn/*
// @description  wrapper for other scripts
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/.libraries/voz.vn%20-%20.library.js
// @require      https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/.libraries/voz.vn%20-%20.hideThreads.js
// @require      https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/.libraries/voz.vn%20-%20.autopager.js

// @downloadURL  https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/voz.vn%20-%20%23main.js
// @updateURL    https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/voz.vn%20-%20%23main.js
// ==/UserScript==
/* globals styles */
console.debug('%c#userscript: %s', styles.debug, GM_info.script.name);
alertNewVersion();
function alertNewVersion() {
    const currentVersion = GM_getValue('scriptVersion') || '0';
    const latestVersion = GM_info.script.version; 
    if (latestVersion > currentVersion){
        GM_setValue('scriptVersion',latestVersion);
        alert('Script: ' + GM_info.script.name + 
            '\nNew version: ' + latestVersion);
    }
}