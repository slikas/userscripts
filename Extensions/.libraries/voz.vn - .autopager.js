// ==UserScript==
// @name         voz.vn - .autopager
// @namespace    http://tampermonkey.net/
// @version      
// @noframes
// ==/UserScript==
const selector_postBody = 'div.block-body.js-replyNewMessageContainer';
const selector_threadList = 'div.structItemContainer-group.js-threadList';
const selector_pageNav = isMobile() ? '.pageNavSimple' : '.pageNav  ';
const selector_nextBody = isInThread() ? selector_postBody : selector_threadList;
const selector_nextPage = isMobile()? 'a.pageNavSimple-el.pageNavSimple-el--next':'a.pageNav-jump.pageNav-jump--next';
AUTOPAGER = {};
AUTOPAGER.observer = {};
AUTOPAGER.observer.callback = function (entries, observer) {
	if (entries[0].intersectionRatio <= 0) return; //target is out of view
	loadNextPage();
}
AUTOPAGER.observer.main = new IntersectionObserver(AUTOPAGER.observer.callback);
AUTOPAGER.observer.target = document.querySelector(isInThread() ? '.block-outer.block-outer--after' : '.p-breadcrumbs.p-breadcrumbs--bottom');
AUTOPAGER.observer.main.observe(AUTOPAGER.observer.target);

function loadNextPage() {
	//window.history.pushState(null, null, href_nextPage);
	(async () => {
		const response = await fetch(getHrefNextPage());
		const textResponse = await response.text();
		appendNextPage(textResponse, selector_nextBody);
	})();
}
function appendNextPage(nextPageHtml, selector) {
	let parser = new DOMParser();
	let doc = parser.parseFromString(nextPageHtml, 'text/html');
	let nextPage = document.createElement('div');
	nextPage = doc.querySelector(selector);
	if (nextPage === null) return;
	let nextPageNav = doc.querySelector(selector_pageNav);
	document.querySelectorAll(selector_pageNav).forEach(pageNav => pageNav.innerHTML = nextPageNav.innerHTML)
	

	document.querySelector(selector).append('-----NEXT PAGE----');
	document.querySelector(selector).appendChild(nextPage);
	colorizeVerticalBorders(nextPage);

	hideThreadsAndAddIgnoreButtons(nextPage);
}
function getHrefNextPage() {
	const nextPageLink = document.querySelector(selector_nextPage);
	if (nextPageLink === null) {
		AUTOPAGER.observer.main.unobserve(AUTOPAGER.observer.target);
		return null;
	}
	return nextPageLink.href;
}
if (isInSub()) {
	try { document.querySelector('.structItemContainer-group--sticky').remove(); } catch { };
}

//let postList = document.querySelector('article.message--post.js-post');