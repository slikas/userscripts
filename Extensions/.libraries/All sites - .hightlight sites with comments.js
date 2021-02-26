// ==UserScript==
// @name         All sites- .highlight sites with comments
// @namespace    http://tampermonkey.net/
// @include      *://*.google.*/*
// @exclude
// @noframes
// ==/UserScript==
/* eslint-disable no-implicit-globals, no-undef */
SITES_WITH_COMMENTS = [
    'vnexpress.net', 'tuoitre.vn', 'vtc.vn', 'thanhnien.vn',
    'theguardian.com', 'nytimes.com', 'washingtonpost.com', 'dailymail.co.uk', 'abcnews.go.com'
]
SITES_WITHOUT_COMMENTS = [
    'nhandan.com.vn', 'congan.com.vn', 'plo.vn', 'baochinhphu.vn', 'ttbc-hcm.gov.vn',
    'channelnewsasia.com', 'todayonline.com', 'nbcnews.com'
]
SITE_INACTIVE_COMMENTS = [
    'vietnamnet.vn', 'tienphong.vn', 'dantri.com.vn'
]
document.querySelectorAll('#rso>div').forEach(result => {
    const site = new URL(result.querySelector('a').href).hostname.replace('www.', '');
    if (hasComments(site) == 'yes') {
        result.style.backgroundColor = 'rgb(109 65 65)';
		result.style.fontWeight = 'bold';
		result.style.fontStyle = 'italic';
        // mobile
        result.firstElementChild.style.backgroundColor = 'rgb(109 65 65)';
		result.firstElementChild.style.fontWeight = 'bold';
		result.firstElementChild.style.fontStyle = 'italic';
    } else if (hasComments(site) == 'no') {
        //result.style.backgroundColor = 'black';
		result.style.opacity = 0.5;
        result.firstElementChild.style.opacity = 0.5;
    } else{
		result.style.opacity = 0.8;
        result.firstElementChild.style.opacity = 0.9;
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