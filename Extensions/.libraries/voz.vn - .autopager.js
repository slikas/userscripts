// ==UserScript==
// @name         voz.vn - .autopager
// @namespace    http://tampermonkey.net/
// @version      
// @noframes
// ==/UserScript==
colorizeVerticalBorders(document.body)
const autopageObserverConfig =
{
	callback: function (entries, observer) {
		if (entries[0].intersectionRatio <= 0) return; //target is out of view
		loadNextPage();
	}
};
function loadNextPage() {
	console.debug('%c#func: %s', styles.debug, getFuncName());
	const selector_pageNav = isMobile() ? '.pageNavSimple' : '.pageNav  ';
	const href_nextPage = getHrefNextPage();
	if (isInThread()) {
		let postBodySelector = 'div.block-body.js-replyNewMessageContainer';
		fetch(href_nextPage)
			.then((data) => data.text())
			.then(function (nextPageHtml) {
				window.history.pushState(null, null, href_nextPage);
				{ // append new page
					const newPageDiv = document.createElement('div');
					newPageDiv.innerHTML = nextPageHtml;
					const newPostBody = newPageDiv.querySelector(postBodySelector);
					document.querySelector(postBodySelector).append('-----NEXT PAGE----');
					colorizeVerticalBorders(newPostBody);
					document.querySelector(postBodySelector).appendChild(newPostBody);
				}
				// replace navigator bars with new ones
				document.querySelectorAll(selector_pageNav).forEach(pageNav=>{
					pageNav.innerHTML = newPageDiv.querySelector(selector_pageNav).innerHTML;
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
				const newPageDiv = document.createElement('div');
				newPageDiv.innerHTML = nextPageHtml;
				document.querySelector(postBodySelector).append('-------NEXT PAGE-----');
				colorizeVerticalBorders(newPageDiv.querySelector(postBodySelector));
				document.querySelector(postBodySelector).appendChild(newPageDiv.querySelector(postBodySelector));
				// replace navigator bars with new ones
				document.querySelectorAll(selector_pageNav).forEach(pageNav=>{
					pageNav.innerHTML = newPageDiv.querySelector(selector_pageNav).innerHTML;
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
const autopageObserver = new IntersectionObserver(autopageObserverConfig.callback);
if (isInSub()) {
	try { document.querySelector('.structItemContainer-group--sticky').remove(); } catch { };
	autopageObserverConfig.target = document.querySelector('.p-breadcrumbs.p-breadcrumbs--bottom');
	autopageObserver.observe(autopageObserverConfig.target);
}
if (isInThread()) {
	autopageObserverConfig.target = document.querySelector('.block-outer.block-outer--after');
	autopageObserver.observe(autopageObserverConfig.target);
}
