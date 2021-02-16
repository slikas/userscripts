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
const href_nextPage = getHrefNextPage();
const AUTOPAGER = {};
AUTOPAGER.observer = {};
AUTOPAGER.observer.callback = function (entries, observer) {
	if (entries[0].intersectionRatio <= 0) return; //target is out of view
	loadNextPage();
}

function loadNextPage() {
	console.debug('%c#func: %s', styles.debug, getFuncName());
	if (isInThread()) {
		let postBodySelector = 'div.block-body.js-replyNewMessageContainer';
		fetch(href_nextPage)
			.then((data) => data.text())
			.then(function (nextPageHtml) {
				window.history.pushState(null, null, href_nextPage);
				{ // append new page
					var nextPage = document.createElement('div');
					nextPage.innerHTML = nextPageHtml;
					const newPostBody = nextPage.querySelector(postBodySelector);
					document.querySelector(postBodySelector).append('-----NEXT PAGE----');
					colorizeVerticalBorders(newPostBody);
					document.querySelector(postBodySelector).appendChild(newPostBody);
				}
				// replace navigator bars with new ones
				document.querySelectorAll(selector_pageNav).forEach(pageNav => {
					pageNav.innerHTML = nextPage.querySelector(selector_pageNav).innerHTML;
				})
			})
	}
	if (isInSub()) {
		let postBodySelector = 'div.structItemContainer-group.js-threadList';
		fetch(href_nextPage)
			.then((data) => data.text())
			.then(function (nextPageHtml) {
				window.history.pushState(null, null, href_nextPage);
				// styling new page
				const nextPage = document.createElement('div');
				nextPage.innerHTML = nextPageHtml;
				document.querySelector(postBodySelector).append('-------NEXT PAGE-----');
				colorizeVerticalBorders(nextPage.querySelector(postBodySelector));
				document.querySelector(postBodySelector).appendChild(nextPage.querySelector(postBodySelector));
				// replace navigator bars with new ones
				document.querySelectorAll(selector_pageNav).forEach(pageNav => {
					pageNav.innerHTML = nextPage.querySelector(selector_pageNav).innerHTML;
				})
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
