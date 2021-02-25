// ==UserScript==
// @name         All sites- .highlight sites with comments
// @namespace    http://tampermonkey.net/
// @include      *://*.google.*/*
// @exclude
// @noframes
// ==/UserScript==
/* eslint-disable no-implicit-globals, no-undef */
SITES_WITH_COMMENTS = [`
    'vnexpress.net',
    'theguardian.com', 'nytimes.com', 'washingtonpost.com', 'dailymail.co.uk'
`]
SITES_WITHOUT_COMMENTS = [`
    'channelnewsasia.com', 'todayonline.com', 'nbcnews.com'
`]
hostname=window.location.hostname;
searchResults = document.querySelectorAll('#rso>div');
for (const result of searchResults) {
    console.log(result);
}