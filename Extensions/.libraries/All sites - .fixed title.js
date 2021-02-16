// ==UserScript==
// @name         All sites- fixed title
// @namespace    http://tampermonkey.net/
// @match        *://*/*
// @exclude      *://*.pythonanywhere.com/*
// @exclude      *://*.google.com/*
// @exclude      *://*.netflix.com/*
// @exclude      *://*.github.com/*
// @noframes
// ==/UserScript==
console.log('#userscript:', GM_info.script.name, '| #version:', GM_info.script.version);
//if (window.location.pathname == '/') return;
const fixedTitleDiv = document.createElement('div');
const fixedTitleDiv_defaultBottom = '0px';
setTimeout(function () {
	fixedTitleDiv.textContent = document.title.slice(0, 70);
	document.body.prepend(fixedTitleDiv);
	// Stylizing fixed title
	fixedTitleDiv.id = 'fixedTitleDiv';
	fixedTitleDiv.style.zIndex = '99999';
	fixedTitleDiv.style.position = 'fixed';
	fixedTitleDiv.style.backgroundColor = 'black';
	fixedTitleDiv.style.color = 'silver';
	fixedTitleDiv.style.fontSize = '17px';
	fixedTitleDiv.style.border = '1px solid silver';
	fixedTitleDiv.style.minWidth = document.body.clientWidth;
	fixedTitleDiv.style.minHeight = '33px'
	fixedTitleDiv.style.left = '3px'
	fixedTitleDiv.style.padding = '0px 5px 0px 5px'
	fixedTitleDiv.style.bottom = fixedTitleDiv_defaultBottom;

	// function for title
	fixedTitleDiv.onclick = function () {
		this.style.bottom=(this.style.bottom==fixedTitleDiv_defaultBottom?
		                   window.innerHeight-parseInt(getComputedStyle(this).height)-1+'px':fixedTitleDiv_defaultBottom);
	}
	const target = document.querySelector('title');
	const config = { childList: true };
	const observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			fixedTitleDiv.textContent = document.title.slice(0, 70);
			observer.disconnect();
		});
	});

	observer.observe(target, config);
	setTimeout(function () {
		observer.disconnect();
	}, 5000);


}, 1000)

