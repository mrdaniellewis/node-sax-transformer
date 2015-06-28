/* jshint node: true, laxbreak: true */
"use strict";

// A useful reference: http://www.liquid-technologies.com/XML/EscapingData.aspx

var escape = require('./xml-escape');

function attributeToString( name, value ) {
	return ' ' + name + '="' + escape(value || '') + '"'; 
}

/**
 *	A text token
 */
function TextToken(text) {
	this.type = 'text';
	this.text = text || '';
}
TextToken.prototype.toString = function() {
	return escape(this.text);
};

/**
 *	A processing instruction token
 */
function ProcessingInstructionToken( ob ) {
	ob = ob || {};

	this.type = 'processinginstruction';
	this.name = ob.name || '';
	this.body = ob.body || '';
}


ProcessingInstructionToken.prototype.toString = function() {
	return '<?' 
		+ this.name 
		+ ( this.body ? ' ' + this.body : '' ) 
		+ '?>';
};

/**
 *	An opentag token
 */
function OpenTagToken( ob ) {
	
	ob = ob || {};

	this.type = 'opentag';
	this.name = ob.name || '';
	this.attributes = ob.attributes || {};
	this.isSelfClosing = !!ob.isSelfClosing;
}

// This does not validate attribute names
OpenTagToken.prototype.toString = function() {
	var tag = '<' + this.name;
	for ( var i in this.attributes ) {
		tag += attributeToString( i, this.attributes[i] );
	}

	if ( this.isSelfClosing ) {
		tag += '/';
	}
	
	tag += '>';

	return tag;
};


/**
 *	A closetag token
 */
function CloseTagToken( name ) {
	this.type = 'closetag';
	this.name = name || '';
}

CloseTagToken.prototype.toString = function() {
	return '</' + this.name + '>';
};

/**
 *	A doctype token
 */
function DocTypeToken( doctype ) {
	this.type = 'doctype';
	this.doctype = doctype || '';
}

DocTypeToken.prototype.toString = function() {
	return '<!DOCTYPE' + this.doctype + '>';
};

/**
 *	A comment token
 */
function CommentToken( text ) {
	this.type = 'comment';
	this.text = text || '';
}

// No attempt at validating the contexts will be made
CommentToken.prototype.toString = function() {
	return '<!--' + this.text + '-->';
};

/**
 *	An open cdata token
 */
function OpenCDataToken() {
	this.type = 'opencdata';
}

OpenCDataToken.prototype.toString = function() {
	return '<![CDATA[';
};

/**
 *	An open cdata token
 */
function CloseCDataToken() {
	this.type = 'closecdata';
}

CloseCDataToken.prototype.toString = function() {
	return ']]>';
};

/**
 *	A cdata token
 */
function CDataToken(text) {
	this.type = 'cdata';
	this.text = text || '';
}

var rCDataClose = /\]\]>/g;
CDataToken.prototype.toString = function() {
	// If the string contains a close c data string it needs to be closed and openned
	return this.text.replace( rCDataClose, ']]>]]&gt;<![CDATA[' );
};

/**
 *	A script token
 */
function ScriptToken(text) {
	this.type = 'script';
	this.text = text || '';
}

ScriptToken.prototype.toString = function() {
	// If the string contains a close c data string it needs to be closed and openned
	return this.text;
};


exports.text = TextToken;
exports.processinginstruction = ProcessingInstructionToken;
exports.opentag = OpenTagToken;
exports.closetag = CloseTagToken;
exports.doctype = DocTypeToken;
exports.comment = CommentToken;
exports.opencdata = OpenCDataToken;
exports.closecdata = CloseCDataToken;
exports.cdata = CDataToken;
exports.script = ScriptToken;
