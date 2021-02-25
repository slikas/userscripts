// ==UserScript==
// @name         All sites - #hide-posts
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @match        *://*/*
// @exclude      https://voz.vn/f/*
// @noframes
// ==/UserScript==
/* global shortenToWords */
HIDE_THREADS = {}
HIDE_THREADS.hrefJSON = 'https://climex.pythonanywhere.com/json/get-thread-ids';
HIDE_THREADS.ids = [];
hidePostsAndAddIgnoreButtons(document.body);
function hidePostsAndAddIgnoreButtons(sourceHTML){
    
}