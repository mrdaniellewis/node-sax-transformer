/* jshint node: true, mocha: true */
"use strict";

var expect = require('expect');
var tokens = require('../lib/tokens.js');
var TokensToString = require('../lib/tokens-to-string.js');
var stream = require('stream');
var fs = require('fs');
var path = require('path');
var collect = require('stream-collect');

/**
 *	Create an object stream from an array
 */
function createObjectStream( ar ) {

	var objectStream = new stream.Readable( {objectMode: true } );
	ar.forEach( objectStream.push, objectStream );
	objectStream.push(null);
	return objectStream;
}


describe( 'TokensToString', function() {

	it( 'creates an TokensToString instance', function() {

		expect( new TokensToString() ).toBeAn( TokensToString );

	} );

	it( 'is a transform stream', function() {

		expect( new TokensToString() ).toBeAn( stream.Transform );

	} );

	it( 'concatates the toString output of the received tokens', function() {

		var tokensToString = new TokensToString();

		return createObjectStream( ['text', {}, [1,2,3] ] )
			.pipe( new TokensToString() )
			.pipe( collect.stream() )
			.then( function(data) {
				expect( data.toString() ).toBe( 'text[object Object]1,2,3');
			} );

	} );

	it( 'ignores undefined tokens', function() {

		var tokensToString = new TokensToString();

		return createObjectStream( ['text', undefined, 'text' ] )
			.pipe( new TokensToString() )
			.pipe( collect.stream() )
			.then( function(data) {
				expect( data.toString() ).toBe( 'texttext');
			} );

	} );

	it( 'ignores a closetag immediatly after a self closing tag', function() {

		var tokensToString = new TokensToString();

		return createObjectStream( [	
				new tokens.opentag( {name:'foo'}),
				new tokens.closetag('foo'),
				new tokens.opentag( {name:'foo', isSelfClosing: true } ),
				new tokens.closetag('foo'),
				new tokens.opentag( {name:'foo'}),
				new tokens.closetag('foo')
			] )
			.pipe( new TokensToString() )
			.pipe( collect.stream() )
			.then( function(data) {
				expect( data.toString() ).toBe( '<foo></foo><foo/><foo></foo>');
			} );

	} );


	

} );



