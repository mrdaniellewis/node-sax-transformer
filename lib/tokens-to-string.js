/* jshint node: true */
"use strict";

var stream = require('stream');
var util = require('util');
var tokens = require('./tokens');

function TokensToString() {
	stream.Transform.call(this, { writableObjectMode: true } );
	this._selfClosed = false;
	this._stack = [];
}

util.inherits( TokensToString, stream.Transform );

TokensToString.prototype._transform = function( token, encoding, cb ) {

	if ( token === undefined ) {
		cb();
		return;
	}

	if ( this._selfClosed ) {
		this._selfClosed = false;
		// A close token is always emitted after a self closing open token
		if ( token instanceof tokens.closetag ) {
			cb();
			return;
		}	
	}

	if ( token instanceof tokens.opentag && token.isSelfClosing ) {
		this._selfClosed = true;
	}

	this.push( token.toString() );
	cb();
};

module.exports = TokensToString;