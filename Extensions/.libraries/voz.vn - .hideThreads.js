// ==UserScript==
// @name         voz.vn - .hideThreads
// @namespace    http://tampermonkey.net/
// @version
// @match        https://voz.vn/f/*
// @noframes
// ==/UserScript==
/* global shortenToWords */
const hrefToGetJson = 'https://climex.pythonanywhere.com/json/get-thread-ids';
hideThreadsAndAddIgnoreButtons(document.body);
// layer 0
function hideThreadsAndAddIgnoreButtons(sourceHTML) {
	const threadInfos = getThreadInfos(sourceHTML);
	hideThreads(threadInfos, getThreadIdsToHideFromLocalStorage());
	addIgnoreButtons(threadInfos);
	(async () => {
		let threadIds = await getThreadIdsFromPtanw_BY_ASYNC();
		//hideThreads(threadInfos, threadIds);
		localStorage.setItem('threadIdsToHide', JSON.stringify(threadIds));
	})();
}
// layer 1
function hideThreads(threadInfos, threadIds) {
	threadInfos.forEach(threadInfo => {
		if (!threadIds.includes(parseInt(threadInfo.id))) return;
		hideThread(threadInfo);
	})
}
function addIgnoreButtons(threadInfos) {
	threadInfos.forEach(thread => {
		const button = document.createElement('button');
		{ // styling button
			button.textContent = 'hide';
			button.style.borderRadius = '4px';
			button.style.position = 'relative';
			thread.container.firstElementChild.firstElementChild.replaceWith(button);
		}
		button.addEventListener('click', callback)
	})

	function callback() {
		const thread = this.parentElement.parentElement;
		const threadInfo = getThreadInfo(thread);
		if (!thread.isIgnored) {
			postToPtanw(threadInfo.id, threadInfo.title);
			hideThread(thread);
		} else {
			alert('already ignored');
		}
	}
}
// layer 2
function getThreadInfos(sourceHTML) {
	const threadsList = sourceHTML.querySelectorAll('div.structItemContainer-group.js-threadList>div');
	let threads = [];
	threadsList.forEach(thread => {
		const threadInfo = getThreadInfo(thread);
		threads.push(threadInfo);
	})
	return threads;
}
async function getThreadIdsFromPtanw_BY_ASYNC() {
	const response = await fetch(hrefToGetJson);
	const threadInfos = await response.json();
	return threadInfos.ids;
}
// layer 3
function getThreadInfo(thread) {
	const threadInfo = {};
	{ // fill info
		threadInfo.id = thread.classList[thread.classList.length - 1].split('-')[2];
		threadInfo.title = thread.querySelector('a[data-preview-url]').textContent;
		threadInfo.url = thread.querySelector('a[data-preview-url]').href;
		threadInfo.container = thread;
	}
	return threadInfo;
}
function hideThread(threadInfo) {
	threadInfo.container.style.opacity = '0.3';
	threadInfo.isIgnored = true;
}
function postToPtanw(threadId = -1, title = 'none') {
	fetch(hrefToGetJson, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			thread_id: parseInt(threadId),
			title: shortenToWords(title, 30)
		})
	}).then(response => {
		return response.json()
	}).then(data => {
		console.log(data);
	});
}


/*
function removeThreadsByLocalStorageId(sourceHTML, threadIdsToHide) {
	threadIdsToHide.forEach(threadId => {
		try { sourceHTML.querySelector('.js-threadListItem-' + threadId).remove(); } catch (error) { };
	})
}
function getThreadIdsToHideFromLocalStorage() {
	return JSON.parse(localStorage.threadIdsToHide || null) || [];
}
*/
//localStorage.setItem('threadIdsToHide', JSON.stringify(threadIdsToHide));
