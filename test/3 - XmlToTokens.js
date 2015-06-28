/* jshint node: true, mocha: true */
"use strict";

var expect = require('expect');
var tokens = require('../lib/tokens.js');
var XmlToTokens = require('../lib/xml-to-tokens.js');
var stream = require('stream');
var fs = require('fs');
var path = require('path');
var collect = require('stream-collect');
var stread = require('stread');

describe( 'XmlToTokens', function() {

	it( 'creates an XmlToTokens instance', function() {

		expect( new XmlToTokens() ).toBeAn( XmlToTokens );

	} );

	it( 'is a transform stream', function() {

		expect( new XmlToTokens() ).toBeAn( stream.Transform );

	} );

	it( 'turns xml into a series of tokens', function() {

		return stread('<root><element>text</element></root>')
			.pipe( new XmlToTokens() )
			.pipe( collect.objectStream() )
			.then( function(data) {
				expect(data).toEqual( [
					new tokens.opentag( { name: 'ROOT' } ),
					new tokens.opentag( { name: 'ELEMENT' } ),
					new tokens.text( 'text' ),
					new tokens.closetag( 'ELEMENT' ),
					new tokens.closetag( 'ROOT' )
				] );
			} );

	} );

	it( 'passes the strict option to the sax constructor', function() {

		// This should error in strict mode
		return stread('<root>')
			.pipe( new XmlToTokens( true ) )
			.pipe( collect.objectStream() )
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
		return stread('<root>')
			.pipe( new XmlToTokens( false, { lowercase: true } ) )
			.pipe( collect.objectStream() )
			.then( function(data) {
				expect(data).toEqual( [
					new tokens.opentag( { name: 'root' } )
				] );
			} );

	} );

	describe( 'passing tokens', function() {

		function collectFromString(str) {

			return stread(str)
				.pipe( new XmlToTokens() )
				.pipe( collect.objectStream() );

		}


		it( 'passes text tokens', function() {

			return collectFromString('text')
				.then( function(data) {
					expect(data).toEqual( [
						new tokens.text( 'text' )
					] );

				} );

		} );

		it( 'passes opentag and closetag tokens', function() {

			return collectFromString('<tag attribute="value"/>')
				.then( function(data) {
					expect(data).toEqual( [
						new tokens.opentag( { name: 'TAG', attributes: { ATTRIBUTE: 'value' }, isSelfClosing: true } ),
						new tokens.closetag( 'TAG' )
					] );

				} );

		} );

		it( 'passes comment tokens', function() {

			return collectFromString('<!-- comment -->')
				.then( function(data) {
					expect(data).toEqual( [
						new tokens.comment( ' comment ' )
					] );

				} );

		} );

		it( 'passes processing instruction tokens', function() {

			return collectFromString('<?process me?>')
				.then( function(data) {
					expect(data).toEqual( [
						new tokens.processinginstruction( {name : 'process', body: 'me' } )
					] );

				} );

		} );

		it( 'passes cdata tokens', function() {

			return collectFromString('<![CDATA[text]]>')
				.then( function(data) {
					expect(data).toEqual( [
						new tokens.opencdata(),
						new tokens.cdata('text'),
						new tokens.closecdata()
					] );

				} );

		} );

		it( 'passes doctype tokens', function() {

			return collectFromString('<!DOCTYPE HTML>')
				.then( function(data) {
					expect(data).toEqual( [
						new tokens.doctype(' HTML')
					] );

				} );

		} );

		it( 'passes script tokens', function() {

			return collectFromString('<script>text</script>')
				.then( function(data) {
					expect(data).toEqual( [
						new tokens.opentag( {name: 'SCRIPT'} ),
						new tokens.script('text'),
						new tokens.closetag( 'SCRIPT' )
					] );

				} );

		} );



	} );


} );



