/* jshint node: true */
"use strict";

// Note use &#39 rather than &apos; for HTML4 (specifically IE8) compatiblity
// See http://stackoverflow.com/questions/2083754/why-shouldnt-apos-be-used-to-escape-single-quotes

var escapes = {
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;', 
	'&': '&amp;'
};

function replace(m) {
	return escapes[m];
}

var rEscape = /[<>"'&]/g;

module.exports = function(str) {
	return str.replace( rEscape, replace );
};