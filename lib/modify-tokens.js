/* jshint node: true */
"use strict";

var stream = require('stream');
var util = require('util');
var tokens = require('./tokens');

/**
 *	Calls an event for each token written to the stream
 */
function TokenTransform( options ) {
	stream.Transform.call(this, { objectMode: true } );
}

util.inherits( TokenTransform, stream.Transform );

TokenTransform.prototype._transform = function( token, encoding, cb ) {
	
	var emitted = this.emit( token.type || 'unknown', token, this._callback.bind( this, cb, token ) );
	
	if ( !emitted ) {
		this.push(token);
		cb();
	}

};

TokenTransform.prototype._callback = function( cb, token, ret ) {

	if ( ret === null || ret === false ) {
		cb();
		return;
	}

	if ( typeof ret === 'object' ) {
		this.push(ret);
	} else {
		this.push(token);
	}

	cb();

};

module.exports = TokenTransform;


