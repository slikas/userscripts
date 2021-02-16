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
	const pageNavSelector = isMobile() ? '.pageNavSimple' : '.pageNav  ';
	const nextPageHref = getNextPageHref();
	if (isInThread()) {
		let postBodySelector = 'div.block-body.js-replyNewMessageContainer';
		fetch(nextPageHref)
			.then((data) => data.text())
			.then(function (nextPageHtml) {
				window.history.pushState(null, null, nextPageHref);
				// styling new page
				const newPageDiv = document.createElement('div');
				newPageDiv.innerHTML = nextPageHtml;
				const newPostBody = newPageDiv.querySelector(postBodySelector);
				document.querySelector(postBodySelector).append('-----NEXT PAGE----');
				colorizeVerticalBorders(newPostBody);
				document.querySelector(postBodySelector).appendChild(newPostBody);
				// replace navigator bars with new ones
				document.querySelectorAll(pageNavSelector).forEach(pageNav=>{
					pageNav.innerHTML = newPageDiv.querySelector(pageNavSelector).innerHTML;
				})
			})
	}
	if (isInSub()) {
		let postBodySelector = 'div.structItemContainer-group.js-threadList';
		fetch(nextPageHref)
			.then((data) => data.text())
			.then(function (nextPageHtml) {
				window.history.pushState(null, null, nextPageHref);
				// styling new page
				const newPageDiv = document.createElement('div');
				newPageDiv.innerHTML = nextPageHtml;
				document.querySelector(postBodySelector).append('-------NEXT PAGE-----');
				colorizeVerticalBorders(newPageDiv.querySelector(postBodySelector));
				document.querySelector(postBodySelector).appendChild(newPageDiv.querySelector(postBodySelector));
				// replace navigator bars with new ones
				document.querySelectorAll(pageNavSelector).forEach(pageNav=>{
					pageNav.innerHTML = newPageDiv.querySelector(pageNavSelector).innerHTML;
				})
			})
	}
}
function getNextPageHref() {
	const nextPageHref = isMobile() ?
		document.querySelector('a.pageNavSimple-el.pageNavSimple-el--next').href :
		document.querySelector('a.pageNav-jump.pageNav-jump--next').href;
	return nextPageHref;
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
