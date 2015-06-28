/* jshint node: true */
"use strict";

var sax = require('sax');
var stream = require('stream');
var util = require('util');
var tokens = require('./tokens');


var onToken = function ( TokenConstructor, ob ) {
	this.push( new TokenConstructor(ob) );
};

function XmlToTokens( strict, options ) {

	stream.Transform.call(this, { readableObjectMode: true } );

	var saxStream = this._sax = sax.createStream( strict, options );

	saxStream.on('error', this.emit.bind( this,'error') );

	for ( var name in tokens ) {
		saxStream.on( name, onToken.bind( this, tokens[name] ) );
	}

}

util.inherits( XmlToTokens, stream.Transform );

XmlToTokens.prototype._transform = function( chunk, encoding, cb ) {
	this._sax.write(chunk);
	cb();
};

XmlToTokens.prototype._flush = function( cb ) {
	this._sax.end();
	cb();
};

module.exports = XmlToTokens;