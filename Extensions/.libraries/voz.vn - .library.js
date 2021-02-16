// ==UserScript==
// @name         voz.vn - .library
// @namespace    http://tampermonkey.net/
// @version
// @noframes
// ==/UserScript==
const CSS_COLOR_NAMES = ['red', 'blue', 'yellow', 'green', 'pink', 'orange', 'indigo', 'violet', 'navy', 'aqua', 'MAROON', 'purple']
let styles = {}
styles.debug = 'color: blue';
styles.log = 'color:green';
function getFuncName() {
	return getFuncName.caller.name
}
function isMobile() {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return true;
	}
	return false;
}
function colorizeVerticalBorders(block) {
	block.style.border = '4px dashed ' + CSS_COLOR_NAMES[Math.floor(Math.random() * CSS_COLOR_NAMES.length)];
}
function isInThread() {
	if (window.location.pathname.startsWith('/t/')) return true;
}
function isInSub() {
	if (window.location.pathname.startsWith('/f/')) return true;
}
function shortenToWords(str, maxLen, separator = ' ') {
	if (str.length <= maxLen) return str;
	return str.substr(0, str.lastIndexOf(separator, maxLen));
}