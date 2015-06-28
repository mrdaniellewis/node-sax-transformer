/* jshint node: true, mocha: true */
"use strict";

var expect = require('expect');
var tokens = require('../lib/tokens.js');
var ModifyTokens = require('../lib/modify-tokens.js');
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


describe( 'ModifyTokens', function() {

	it( 'creates an ModifyTokens instance', function() {

		expect( new ModifyTokens() ).toBeAn( ModifyTokens );

	} );

	it( 'is a transform stream', function() {

		expect( new ModifyTokens() ).toBeAn( stream.Transform );

	} );

	describe( 'events', function() {
		
		it( 'passes tokens though if no events are added', function() {

			var ob1 = {};
			var ob2 = {};

			return createObjectStream( [ob1,ob2 ] )
				.pipe( new ModifyTokens() )
				.pipe( collect.objectStream() )
				.then( function(data) {
					expect( data.length ).toBe( 2 );
					expect( data[0] ).toBe( ob1 );
					expect( data[1] ).toBe( ob2 );
				} );

		} );

		it( 'passes objects via a call back if an event is added', function() {

			var ob = { type: 'test' };

			var modify = new ModifyTokens();

			function event(token, cb ) {
				cb();
			}

			var spy = expect.createSpy(event).andCallThrough();
			modify.on( 'test', spy );

			return createObjectStream( [ob ] )
				.pipe( modify )
				.pipe( collect.objectStream() )
				.then( function(data) {
					expect(spy.calls.length).toEqual(1);
					expect( data[0] ).toBe( ob );
				} );

		} );

		it( 'allows an object to be replaced using the callback', function() {

			var ob = { type: 'test' };
			var ob2 = {};

			var modify = new ModifyTokens();
			modify.on( 'test', function (token, cb ) {
				cb(ob2);
			} );


			return createObjectStream( [ob ] )
				.pipe( modify )
				.pipe( collect.objectStream() )
				.then( function(data) {
					expect( data[0] ).toBe( ob2 );
				} );

		} );

		it( 'allows an object to be removed by returning false to the callback', function() {

			var ob = { type: 'test' };
			var ob2 = {};

			var modify = new ModifyTokens();
			modify.on( 'test', function (token, cb ) {
				cb(false);
			} );


			return createObjectStream( [ob ] )
				.pipe( modify )
				.pipe( collect.objectStream() )
				.then( function(data) {
					expect( data ).toEqual( [] );
				} );

		} );

		it( 'allows an object to be removed by returning null to the callback', function() {

			var ob = { type: 'test' };
			var ob2 = {};

			var modify = new ModifyTokens();
			modify.on( 'test', function (token, cb ) {
				cb(null);
			} );


			return createObjectStream( [ob ] )
				.pipe( modify )
				.pipe( collect.objectStream() )
				.then( function(data) {
					expect( data ).toEqual( [] );
				} );

		} );

		it( 'waits for the callback before processing the next token', function() {

			var actions = [];

			var modify = new ModifyTokens();
			modify.on( 'test1', function (token, cb ) {
				actions.push('test1');

				setImmediate( function() {
					actions.push('setImmediate');
					cb();
				} );

			} );
			modify.on( 'test2', function (token, cb ) {
				actions.push('test2');
				cb();
			} );


			return createObjectStream( [ {type:'test1'}, {type: 'test2'}] )
				.pipe( modify )
				.pipe( collect.objectStream() )
				.then( function(data) {
					expect( actions ).toEqual( ['test1','setImmediate','test2'] );
				} );

		} );

	} );

	


} );



