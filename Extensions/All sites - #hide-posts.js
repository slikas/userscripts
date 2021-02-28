// ==UserScript==
// @name         All sites - #hide-posts
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @match        *://*/*
// @exclude      111  https://voz.vn/f/*
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL  https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/All%20sites%20-%20%23hide-posts.js
// @updateURL    https://raw.githubusercontent.com/slikas/userscripts/main/Extensions/All%20sites%20-%20%23hide-posts.js
// ==/UserScript==
/* global shortenToWords */
HIDE_POSTS = {}
HIDE_POSTS.hrefJSON_host = 'https://climex.pythonanywhere.com/json/get-post-ids/';
HIDE_POSTS.hrefJSON_full = new URL(location.hostname, HIDE_POSTS.hrefJSON_host).href;
HIDE_POSTS.ids = [];

hidePostsAndAddIgnoreButtons(document.body);
function hidePostsAndAddIgnoreButtons(sourceHTML) {
    addIgnoreButtons(sourceHTML);
}
function addIgnoreButtons(sourceHTML) {
    const post = {};
    switch (location.hostname) {
        case 'songmeanings.com': {
            post.containerList = document.querySelectorAll('#comments-list > li');
            break;
        }
        case 'voz.vn': {
            post.containerList = document.querySelectorAll('.structItem-cell.structItem-cell--meta');
            break;
        }
    }
    // Apply to all
    post.containerList.forEach(container => {
        const button = createButton();
        container.prepend(button);
        button.addEventListener('click', callback.bind(event, container));
    })

    // helpers
    function callback(container) {
        hidePost(container);
    }
    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'hide this post';
        button.style.color = 'green';
        return button;
    }
}

function hidePost(post) {
    post.style.opacity = 0.3;
    post.style.maxHeight = '50px';
    post.isHidden = true;
}

alertNewVersion();
function alertNewVersion() {
    const currentVersion = GM_getValue('scriptVersion') || '0';
    const latestVersion = GM_info.script.version;
    if (latestVersion > currentVersion) {
        GM_setValue('scriptVersion', latestVersion);
        alert('Script: ' + GM_info.script.name +
            '\nNew version: ' + latestVersion);
    }
}