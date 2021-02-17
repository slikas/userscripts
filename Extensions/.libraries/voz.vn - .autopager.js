// ==UserScript==
// @name         voz.vn - .autopager
// @namespace    http://tampermonkey.net/
// @version      
// @noframes
// ==/UserScript==
colorizeVerticalBorders(document.body)
const selector_postBody = 'div.block-body.js-replyNewMessageContainer';
const selector_threadList = 'div.structItemContainer-group.js-threadList';
const selector_pageNav = isMobile() ? '.pageNavSimple' : '.pageNav  ';
const AUTOPAGER = {};
AUTOPAGER.observer = {};
AUTOPAGER.observer.callback = function (entries, observer) {
	if (entries[0].intersectionRatio <= 0) return; //target is out of view
	loadNextPage();
}
function appendNextPage(nextPageHtml, selector) {
	let parser = new DOMParser();
	let doc = parser.parseFromString(nextPageHtml, 'text/html');
	let nextPage = document.createElement('div');
	let nextPageNav = doc.querySelector(selector_pageNav);
	document.querySelectorAll(selector_pageNav).forEach(pageNav => {
		pageNav.innerHTML = nextPageNav.innerHTML;
	})
	nextPage = doc.querySelector(selector);
	
	document.querySelector(selector).append('-----NEXT PAGE----');
	document.querySelector(selector).appendChild(nextPage);
	colorizeVerticalBorders(nextPage);

	hideThreadsAndAddIgnoreButtons(nextPage);
}
function loadNextPage() {
	//console.debug('%c#func: %s', styles.debug, getFuncName());
	const href_nextPage = getHrefNextPage();
	window.history.pushState(null, null, href_nextPage);
	if (isInThread()) {
		fetch(href_nextPage).then((data) => data.text()).then(function (nextPageHtml) {
			appendNextPage(nextPageHtml, selector_postBody);

		})
	}
	if (isInSub()) {
		fetch(href_nextPage).then((data) => data.text()).then(function (nextPageHtml) {
			appendNextPage(nextPageHtml, selector_threadList);
		})
	}
}
function getHrefNextPage() {
	const href_nextPage = isMobile() ?
		document.querySelector('a.pageNavSimple-el.pageNavSimple-el--next').href :
		document.querySelector('a.pageNav-jump.pageNav-jump--next').href;
	return href_nextPage;
}
AUTOPAGER.observer.main = new IntersectionObserver(AUTOPAGER.observer.callback);
if (isInSub()) {
	try { document.querySelector('.structItemContainer-group--sticky').remove(); } catch { };
	AUTOPAGER.observer.target = document.querySelector('.p-breadcrumbs.p-breadcrumbs--bottom');
	AUTOPAGER.observer.main.observe(AUTOPAGER.observer.target);
}
if (isInThread()) {
	AUTOPAGER.observer.target = document.querySelector('.block-outer.block-outer--after');
	AUTOPAGER.observer.main.observe(AUTOPAGER.observer.target);
}
