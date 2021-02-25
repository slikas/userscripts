// ==UserScript==
// @name         All sites - #hide-posts
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @match        *://*/*
// @exclude      https://voz.vn/f/*
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL  https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/All%20sites%20-%20%23hide-posts.js
// @updateURL    https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/All%20sites%20-%20%23hide-posts.js
// ==/UserScript==
/* global shortenToWords */
const hostname = window.location.hostname;
HIDE_POSTS = {}
HIDE_POSTS.hrefJSON_host = 'https://climex.pythonanywhere.com/json/get-post-ids/';
HIDE_POSTS.hrefJSON_full = new URL(hostname, HIDE_POSTS.hrefJSON_host).href;
HIDE_POSTS.ids = [];

hidePostsAndAddIgnoreButtons(document.body);
function hidePostsAndAddIgnoreButtons(sourceHTML){
    addIgnoreButtons(sourceHTML);
}
function addIgnoreButtons(sourceHTML){

}


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