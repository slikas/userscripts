// ==UserScript==
// @name         voz.vn - .hideThreads
// @namespace    http://tampermonkey.net/
// @version
// @match        https://voz.vn/f/*
// @noframes
// ==/UserScript==
/* eslint-disable no-lone-blocks */
/* global shortenToWords */
const hrefToGetJson = 'https://climex.pythonanywhere.com/json/get-thread-ids';
hideThreads(document.body);
function hideThreads(sourceHTML) {
	const threadIds = getThreadIdsFromPtanw_BY_ASYNC();
	console.debug(threadIds);
	/*Promise {<pending>}
	[[PromiseState]]: "fulfilled"
	[[PromiseResult]]: Array(5) 
	*/
	let threads = getThreads(sourceHTML);
	addIgnoreThreadButtons(sourceHTML, threads);
}
function getThreads(sourceHTML) {
	const threadsList = sourceHTML.querySelectorAll('div.structItemContainer-group.js-threadList>div');
	let threads = [];
	threadsList.forEach(thread => {
		const threadInfo = getThreadInfo(thread);
		threads.push(threadInfo);
	})
	return threads;
}
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
function postToPtanw(threadId = -1, title = 'none') {
	fetch('https://climex.pythonanywhere.com/json/get-thread-ids', {
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
function addIgnoreThreadButtons(sourceHTML) {
	getThreads(sourceHTML).forEach(thread => {
		const button = document.createElement('button');
		{ // styling button
			button.textContent = 'hide';
			button.style.borderRadius = '4px';
			button.style.position = 'relative';
			thread.container.firstElementChild.firstElementChild.replaceWith(button);
		}
		button.addEventListener('click', function () {
			const thread = this.parentElement.parentElement;
			const threadInfo = getThreadInfo(thread);
			if (!thread.isIgnored) {
				postToPtanw(threadInfo.id, threadInfo.title);
				disableThread(thread);
			} else {
				alert('already ignored');
			}
		});
	})
}
function disableThread(thread) {
	thread.style.opacity = '0.3';
	thread.isIgnored = true;
}

function getThreadIdsFromPtanw_BY_CHAINING_THEN() {
	fetch(hrefToGetJson).
		then(response => response.json()).
		then(threadInfos => {
			console.debug(threadInfos);
			console.debug(threadInfos.ids);
			return threadInfos.ids
		})
}
async function getThreadIdsFromPtanw_BY_ASYNC() {
	const response = await fetch(hrefToGetJson);
	const threadInfos = await response.json();
	console.debug(threadInfos);
	return threadInfos.ids;
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
