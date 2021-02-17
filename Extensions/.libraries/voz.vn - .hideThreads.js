// ==UserScript==
// @name         voz.vn - .hideThreads
// @namespace    http://tampermonkey.net/
// @version
// @match        https://voz.vn/f/*
// @noframes
// ==/UserScript==
/* global shortenToWords */
HIDE_THREADS = {}
HIDE_THREADS.hrefJSON = 'https://climex.pythonanywhere.com/json/get-thread-ids';
HIDE_THREADS.ids =[];
hideThreadsAndAddIgnoreButtons(document.body);
// layer 0
function hideThreadsAndAddIgnoreButtons(sourceHTML) {
	const threadInfoList = getThreadInfoList(sourceHTML);
	HIDE_THREADS.ids = getThreadIdsToHideFromLocalStorage();
	hideThreads(threadInfoList);
	
	(async () => {
		HIDE_THREADS.ids = await getThreadIdsFromPtanw_BY_ASYNC();
		hideThreads(threadInfoList);
		localStorage.setItem('threadIdsToHide', JSON.stringify(HIDE_THREADS.ids));
	})();

	addIgnoreButtons(threadInfoList);
}
// layer 1
function hideThreads(threadInfoList) {
	threadInfoList.forEach(threadInfo => {
		if (!HIDE_THREADS.ids.includes(parseInt(threadInfo.id))) return;
		hideThreadAndFlag(threadInfo);
	})
}
async function hideThreadsByPtawn(){
}
function addIgnoreButtons(threadInfoList) {
	threadInfoList.forEach(threadInfo => {
		const button = document.createElement('button');
		{ // styling button
			button.textContent = 'hide';
			button.style.borderRadius = '4px';
			button.style.position = 'relative';
			threadInfo.container.firstElementChild.firstElementChild.replaceWith(button);
		}
		button.addEventListener('click', callback.bind(event, threadInfo));
	})
	function callback(threadInfo) {
		if (threadInfo.isIgnored) {
			alert('already ignored');
		} else {
			postToPtanw(threadInfo.id, threadInfo.title);
			hideThreadAndFlag(threadInfo);
			HIDE_THREADS.ids.push(parseInt(threadInfo.id));
			localStorage.setItem('threadIdsToHide', JSON.stringify(HIDE_THREADS.ids));
		}
	}
}
// layer 2
function getThreadInfoList(sourceHTML) {
	const threadsList = sourceHTML.querySelectorAll('div.structItemContainer-group.js-threadList>div');
	let threads = [];
	threadsList.forEach(thread => {
		const threadInfo = getThreadInfo(thread);
		threads.push(threadInfo);
	})
	return threads;
}
async function getThreadIdsFromPtanw_BY_ASYNC() {
	const response = await fetch(HIDE_THREADS.hrefJSON);
	const threadInfoList = await response.json();
	return threadInfoList.ids;
}
// layer 3
function getThreadInfo(thread) {
	const threadInfo = {};
	threadInfo.id = thread.classList[thread.classList.length - 1].split('-')[2];
	threadInfo.title = thread.querySelector('a[data-preview-url]').textContent;
	threadInfo.url = thread.querySelector('a[data-preview-url]').href;
	threadInfo.container = thread;
	return threadInfo;
}
function hideThreadAndFlag(threadInfo) {
	threadInfo.container.style.opacity = '0.3';
	threadInfo.isIgnored = true;
}
function postToPtanw(threadId = -1, title = 'none') {
	fetch(HIDE_THREADS.hrefJSON, {
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
function getThreadIdsToHideFromLocalStorage() {
	return JSON.parse(localStorage.threadIdsToHide || null) || [];
}