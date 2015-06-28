/* jshint node: true, mocha: true */
"use strict";

var expect = require('expect');
var escape = require( '../lib/xml-escape');

describe( 'xmlEscape', function() {

	it( 'escapes the expected characaters', function() {
		expect( escape('1<2>3"4\'5&6') )
			.toBe( '1&lt;2&gt;3&quot;4&#39;5&amp;6' );
	} );

} );
