// ==UserScript==
// @name         All sites - #hide-posts
// @namespace    http://tampermonkey.net/
// @version      0.0.4
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
HIDE_POSTS.hostname = window.location.hostname.replace('www.', '');
HIDE_POSTS.hrefJSON_host = 'https://climex.pythonanywhere.com/json/get-post-ids/';
HIDE_POSTS.hrefJSON_full = new URL(HIDE_POSTS.hostname, HIDE_POSTS.hrefJSON_host).href;
HIDE_POSTS.ids = [];
HIDE_POSTS.postList = [];
hidePostsAndAddIgnoreButtons(document.body);
function hidePostsAndAddIgnoreButtons(sourceHTML) {
    addIgnoreButtons(sourceHTML);
}
function addIgnoreButtons(sourceHTML) {
    switch (HIDE_POSTS.hostname) {
        case 'songmeanings.com': {
            HIDE_POSTS.postList = document.querySelectorAll('#comments-list > li');
            break;
        }
        case 'voz.vn': {
            HIDE_POSTS.postList = document.querySelectorAll('.structItem-cell.structItem-cell--meta');
            break;
        }
        case 'vnexpress.net': {
            HIDE_POSTS.postList = document.querySelectorAll('p.block_like_web.width_common');
            break;
        }
        case 'theguardian.com': {
            setTimeout( ()=>{
                HIDE_POSTS.postList = document.querySelectorAll('div[id^="comment-"][data-testid]');
            },2000);
            break;
        }
    }
    // Apply to all
    HIDE_POSTS.postList.forEach(post => {
        const button = createButton();
        post.prepend(button);
        button.addEventListener('click', callback.bind(event, post));
    })

    // helpers
    function callback(post) {
        hidePost(post);
        alert(getPostId(post));
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
async function postIdToPtanw(id) {
    const response = await fetch(HIDE_POSTS.hrefJSON_full);
}
function getPostId(post) {
    switch (HIDE_POSTS.hostname) {
        case 'songmeanings.com': {
            return post.querySelector('a[name^="comment-"]').name.split('-')[1];
        }
        case 'voz.vn': {
            return post.querySelector('div[class*="js-threadListItem-"]').name.split('-')[1];
        }
        case 'theguardian.com':{
            return post.querySelector('div[id^="comment-"][data-testid]').id.split('-')[1];
        }
    }
}

function postThreadToPtanw(threadId = -1, title = 'none') {
    fetch(HIDE_THREADS.hrefJSON, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            thread_id: parseInt(threadId),
            title: shortenToWords(title, 30)
        })
    }).then(response => {
        return response.json()
    }).then(data => {
        console.log(data);
    });
}