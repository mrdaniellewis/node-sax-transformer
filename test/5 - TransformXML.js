/* jshint node: true, mocha: true */
"use strict";

var expect = require('expect');
var tokens = require('../lib/tokens.js');
var TransformXML = require('../lib/transform-xml.js');
var stream = require('stream');
var fs = require('fs');
var path = require('path');
var collect = require('stream-collect');
var stread = require('stread');

describe( 'TransformXML', function() {

	it( 'creates an TransformXML instance', function() {

		expect( new TransformXML() ).toBeA( TransformXML );

	} );

	it( 'is a duplex stream', function() {

		expect( new TransformXML() ).toBeA( stream.Duplex );

	} );

	it( 'can be instigated without the new operator', function() {
		// jshint -W064
		expect( TransformXML() ).toBeA( TransformXML );

	} );

	it( 'has exposes tokens on the property tokens', function() {
		// jshint -W064
		expect( TransformXML.tokens ).toBe( tokens );

	} );



	it( 'passes thought xml', function() {

		return stread( '<?xml version="1.0"?><root></root>')
			.pipe( new TransformXML() )
			.pipe( collect.stream() )
			.then( function(output) {
				expect( output.toString() ).toEqual( '<?xml version="1.0"?><root></root>' );
			} );

	} );

	it( 'allows XML to be modified', function() {

		var transform = new TransformXML();
		transform.on( 'opentag', function( token, cb ) {
			token.name = 'foo';
			cb();
		} );
		transform.on( 'closetag', function( token, cb ) {
			token.name = 'foo';
			cb();
		} );

		return stread( '<?xml version="1.0"?><root></root>')
			.pipe( transform )
			.pipe( collect.stream() )
			.then( function(output) {
				expect( output.toString() ).toEqual( '<?xml version="1.0"?><foo></foo>' );
			} );

	} );

	it( 'passes the strict option to the sax constructor', function() {

		// This should error in strict mode
		return stread('<root>')
			.pipe( new TransformXML( true ) )
			.pipe( collect.stream() )
			.then( function(data) {
				throw new Error('Should not have been called');
			} )
			.catch( function(e) {
				expect(e).toBeAn(Error);
				expect(e.message.split('\n')[0]).toBe( 'Unclosed root tag');
			} );

	} );

	it( 'passes options to the sax constructor', function() {

		// This should error in strict mode
		return stread('<root>&yen;</root>')
			.pipe( new TransformXML( false, { strictEntities: true } ) )
			.pipe( collect.stream() )
			.then( function(output) {
				expect( output.toString() ).toEqual( '<root>&amp;yen;</root>' );
			} );

	} );

	it( 'allows lowercase to be set to false', function() {

		// This should error in strict mode
		return stread('<root>test</root>')
			.pipe( new TransformXML( false, { lowercase: false } ) )
			.pipe( collect.stream() )
			.then( function(output) {
				expect( output.toString() ).toEqual( '<ROOT>test</ROOT>' );
			} );

	} );
} );



