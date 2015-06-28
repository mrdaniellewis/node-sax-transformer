/* jshint node: true */
"use strict";

var util = require('util');
var XMLToTokens = require('./xml-to-tokens');
var ModifyTokens = require('./modify-tokens');
var TokensToString = require( './tokens-to-string');
var tokens = require('./tokens');
var PipeBox = require('pipe-box');
var stream = require('stream');

function TransformXML( strict, options ) {

	if( !(this instanceof TransformXML) ) {
		return new TransformXML( strict, options );
	}

	options = options || {};
	// Default to lowercase
	options.lowercase = options.lowercase !== undefined ? options.lowercase : true;

	var input = this._inputStream = new XMLToTokens( strict, options );
	var modify = new ModifyTokens();
	var stringify = new TokensToString();

	// Pass event listeners to modify
	this.on( 'newListener', function( name, fn ) {
		if ( name in tokens ) {
			modify.on( name, fn );
		}
	} );
	this.on( 'removeListener', function( name, fn ) {
		if ( name in tokens ) {
			modify.removeListener( name, fn );
		}
	} );

	input.on('error', this.emit.bind( this, 'error' ) );
	modify.on('error', this.emit.bind( this, 'error' ) );	
	stringify.on('error', this.emit.bind( this, 'error' ) );	

	this._outputStream = this._inputStream.pipe(modify).pipe(stringify);

	PipeBox.call(this);

}

util.inherits( TransformXML, PipeBox );

module.exports = TransformXML;
TransformXML.tokens = tokens;