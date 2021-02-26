// ==UserScript==
// @name         All sites- .highlight sites with comments
// @namespace    http://tampermonkey.net/
// @match        *://*/*
// @exclude
// @noframes
// ==/UserScript==
/* eslint-disable no-implicit-globals, no-undef */
console.log('hightlight sites with coomments');
SITES_WITH_COMMENTS = [
    'vnexpress.net', 'tuoitre.vn', 'vtc.vn', 'thanhnien.vn',
    'theguardian.com', 'nytimes.com', 'washingtonpost.com', 'dailymail.co.uk', 'abcnews.go.com'
]
SITES_WITHOUT_COMMENTS = [
    'nhandan.com.vn', 'congan.com.vn', 'plo.vn', 'baochinhphu.vn', 'ttbc-hcm.gov.vn', 'thuvienphapluat.vn',
    'channelnewsasia.com', 'todayonline.com', 'nbcnews.com',
    'japantimes.co.jp'
]
SITE_INACTIVE_COMMENTS = [
    'vietnamnet.vn', 'tienphong.vn', 'dantri.com.vn'
]
document.querySelectorAll('#rso>div' + (isMobile() ? '>:first-child' : '')).forEach(result => {
    switch (hasComments(new URL(result.querySelector('a').href).hostname.replace('www.', ''))) {
        case 'yes': {
            result.style.backgroundColor = 'rgb(109 65 65)';
            result.style.fontWeight = 'bold';
            result.style.fontStyle = 'italic';
            break;
        }
        case 'no': {
            result.style.opacity = 0.7;
            break;
        }
        case 'inactive': {
            result.style.opacity = 1;
            break;
        }
    }
})

// helpers
function hasComments(site) {
    if (SITES_WITH_COMMENTS.includes(site)) return 'yes';
    if (SITES_WITHOUT_COMMENTS.includes(site)) return 'no';
    if (SITE_INACTIVE_COMMENTS.includes(site)) return 'inactive';
    else return 'unsure';
}
function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
}