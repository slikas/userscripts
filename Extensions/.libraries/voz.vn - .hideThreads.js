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
HIDE_THREADS.ids = [];
hideThreadsAndAddIgnoreButtons(document.body);
// layer 0
function hideThreadsAndAddIgnoreButtons(sourceHTML) {
	const threadList = getThreadList(sourceHTML);
	HIDE_THREADS.ids = getThreadIdsToHideFromLocalStorage();
	hideThreads(threadList);
	hideThreadsByPtawn(threadList);
	addIgnoreButtons(threadList);
}
// layer 1
function hideThreads(threadList) {
	threadList.forEach(thread => {
		if (!HIDE_THREADS.ids.includes(parseInt(thread.id))) return;
		hideThreadAndFlag(thread);
	})
}
async function hideThreadsByPtawn(threadList) {
	HIDE_THREADS.ids = await getThreadIdsFromPtanw_BY_ASYNC();
	hideThreads(threadList);
	localStorage.setItem('threadIdsToHide', JSON.stringify(HIDE_THREADS.ids));
}
function addIgnoreButtons(threadList) {
	threadList.forEach(thread => {
		const button = createIgnoreButton();
		thread.container.firstElementChild.firstElementChild.replaceWith(button);
		button.addEventListener('click', callback.bind(event, thread));
	})
	// helper functions
	function callback(thread) {
		if (thread.isIgnored) {
			alert('already ignored');
		} else {
			postThreadToPtanw(thread.id, thread.title);
			hideThreadAndFlag(thread);
			HIDE_THREADS.ids.push(parseInt(thread.id));
			localStorage.setItem('threadIdsToHide', JSON.stringify(HIDE_THREADS.ids));
		}
	}
	function createIgnoreButton() {
		const button = document.createElement('button');
		button.textContent = 'hide';
		button.style.borderRadius = '4px';
		button.style.position = 'relative';
		return button;
	}
}
// layer 2
function getThreadList(sourceHTML) {
	const threadList = [];
	sourceHTML.querySelectorAll('div.structItemContainer-group.js-threadList>div').forEach(thread => {
		threadList.push(getThreadInfo(thread));
	})
	return threadList;
}
async function getThreadIdsFromPtanw_BY_ASYNC() {
	const response = await fetch(HIDE_THREADS.hrefJSON);
	const threadList = await response.json();
	return threadList.ids;
}
// layer 3
function getThreadInfo(thread) {
	return {
		id: thread.classList[thread.classList.length - 1].split('-')[2],
		title : thread.querySelector('a[data-preview-url]').textContent.container,
		url : thread.querySelector('a[data-preview-url]').href,
		container : thread
	}
}
function hideThreadAndFlag(thread) {
	thread.container.style.opacity = '0.3';
	thread.isIgnored = true;
}
function postThreadToPtanw(threadId = -1, title = 'none') {
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