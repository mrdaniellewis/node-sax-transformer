/* jshint node: true, mocha: true */
"use strict";

var expect = require('expect');
var tokens = require('../lib/tokens.js');

describe( 'text token', function() {

	var Token = tokens.text;

	it( 'returns a text instance', function() {
		expect( new Token() ).toBeA( Token );
	} );

	it( 'has a type of text', function() {
		expect( new Token().type ).toBe('text');
	} );

	it( 'seralises to a XML text', function() {
		var token = new Token('<b>bold</b>');
		expect( token.toString() ).toBe('&lt;b&gt;bold&lt;/b&gt;');
	} );

	it( 'seralises if no value is set', function() {
		var token = new Token();
		expect( token.toString() ).toBe('');
	} );

} );

describe( 'processinginstruction token', function() {

	var Token = tokens.processinginstruction;

	it( 'returns a processinginstruction instance', function() {
		expect( new Token() )
			.toBeA( Token );
	} );

	it( 'has a type of processinginstruction', function() {
		expect( new Token().type ).toBe('processinginstruction');
	} );

	it( 'seralises to a processing instruction', function() {
		var token = new Token( { name: 'name', body: 'foo="bar"' });
		expect( token.toString() ).toBe('<?name foo="bar"?>');
	} );

	it( 'can seralise without a body', function() {
		var token = new Token( { name: 'name' });
		expect( token.toString() ).toBe('<?name?>');
	} );

	it( 'can seralise if no value is set', function() {
		var token = new Token();
		expect( token.toString() ).toBe('<??>');
	} );

} );

describe( 'opentag token', function() {

	var Token = tokens.opentag;

	it( 'returns an opentag instance', function() {
		expect( new Token() )
			.toBeA( Token );
	} );

	it( 'has a type of opentag', function() {
		expect( new Token().type ).toBe('opentag');
	} );

	it( 'seralises to an open tag', function() {
		expect( new Token( { name: 'tag', attributes: { foo: '<bar>', fee: 'fi' } }).toString() )
			.toBe('<tag foo="&lt;bar&gt;" fee="fi">');
	} );

	it( 'seralises to a self-closing tag', function() {
		expect( new Token( { 
			name: 'tag', 
			attributes: { foo: '<bar>', fee: 'fi' }, 
			isSelfClosing: true
		}).toString() )
			.toBe('<tag foo="&lt;bar&gt;" fee="fi"/>');
	} );

	it( 'can seralise if no attributes are set', function() {
		var token = new Token( {name: 'name'});
		expect( token.toString() ).toBe('<name>');
	} );

	it( 'can seralise if no value is set', function() {
		var token = new Token();
		expect( token.toString() ).toBe('<>');
	} );


} );

describe( 'closetag token', function() {

	var Token = tokens.closetag;

	it( 'returns an closetag instance', function() {
		expect( new Token() )
			.toBeA( Token );
	} );

	it( 'has a type of closetag', function() {
		expect( new Token().type ).toBe('closetag');
	} );

	it( 'seralises to a close tag', function() {
		expect( new Token( 'name' ).toString() )
			.toBe('</name>');
	} );

	it( 'can seralise if no value is set', function() {
		var token = new Token();
		expect( token.toString() ).toBe('</>');
	} );


} );

describe( 'doctype token', function() {

	var Token = tokens.doctype;

	it( 'returns an doctype instance', function() {
		expect( new Token() )
			.toBeA( Token );
	} );

	it( 'has a type of doctype', function() {
		expect( new Token().type ).toBe('doctype');
	} );

	it( 'seralises to a doctype tag', function() {
		expect( new Token( ' HTML' ).toString() )
			.toBe('<!DOCTYPE HTML>');
	} );

	it( 'can seralise if no value is set', function() {
		var token = new Token();
		expect( token.toString() ).toBe('<!DOCTYPE>');
	} );


} );

describe( 'comment token', function() {

	var Token = tokens.comment;

	it( 'returns an comment instance', function() {
		expect( new Token() )
			.toBeA( Token );
	} );

	it( 'has a type of comment', function() {
		expect( new Token().type ).toBe('comment');
	} );

	it( 'seralises to a comment tag', function() {
		expect( new Token( 'My comment <foo>' ).toString() )
			.toBe('<!--My comment <foo>-->');
	} );

	it( 'can seralise if no value is set', function() {
		var token = new Token();
		expect( token.toString() ).toBe('<!---->');
	} );


} );

describe( 'opencdata token', function() {

	var Token = tokens.opencdata;

	it( 'returns an opencdata instance', function() {
		expect( new Token() )
			.toBeA( Token );
	} );

	it( 'has a type of opencdata', function() {
		expect( new Token().type ).toBe('opencdata');
	} );

	it( 'seralises to an opencdata tag', function() {
		expect( new Token().toString() )
			.toBe('<![CDATA[');
	} );


} );

describe( 'closecdata token', function() {

	var Token = tokens.closecdata;

	it( 'returns an closecdata instance', function() {
		expect( new Token() )
			.toBeA( Token );
	} );

	it( 'has a type of closecdata', function() {
		expect( new Token().type ).toBe('closecdata');
	} );

	it( 'seralises to an closecdata tag', function() {
		expect( new Token().toString() )
			.toBe(']]>');
	} );


} );

describe( 'cdata token', function() {

	var Token = tokens.cdata;

	it( 'returns an cdata instance', function() {
		expect( new Token() )
			.toBeA( Token );
	} );

	it( 'has a type of cdata', function() {
		expect( new Token().type ).toBe('cdata');
	} );

	it( 'seralises to cdata', function() {
		expect( new Token( 'this is some cdata text & > < " \'').toString() )
			.toBe('this is some cdata text & > < " \'');
	} );

	it( 'seralises if not data is set', function() {
		expect( new Token().toString() )
			.toBe('');
	} );

	it( 'splits data containing ]]>', function() {
		expect( new Token( 'foo ]]> bar ]]> foo' ).toString() )
			.toBe('foo ]]>]]&gt;<![CDATA[ bar ]]>]]&gt;<![CDATA[ foo');
	} );


} );

describe( 'script token', function() {

	var Token = tokens.script;

	it( 'returns a script instance', function() {
		expect( new Token() )
			.toBeA( Token );
	} );

	it( 'has a type of script', function() {
		expect( new Token().type ).toBe('script');
	} );

	it( 'seralises to unencoded text', function() {
		expect( new Token( 'this is some script data & > < " \'').toString() )
			.toBe('this is some script data & > < " \'');
	} );

	it( 'seralises if not data is set', function() {
		expect( new Token().toString() )
			.toBe('');
	} );

} );


