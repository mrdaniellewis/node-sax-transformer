/* jshint node: true */

var sax = require('sax');
var stream = require('stream');
var util = require('util');






function XmlToTokens() {

	stream.Transform.call(this, { readableObjectMode: true } );

	this._sax = sax.createStream()
		.on( 'opentag', function( name, attributes ) { 
			this.push( new tokens.OpenTagToken( name, attributes, selfClosing ) );
		}.bind(this) )
		.on( 'closetag', function( name ) { 
			this.push( new tokens.CloseTagToken( name ) );
		}.bind(this) )
		.on( 'text', function( text ) { 
			this.push( new tokens.TextToken( text ) );
		}.bind(this) )
		.on( 'processinginstruction', function( name, body ) { 
			this.push( new tokens.ProcessingInstructionToken( name, body ) );
		}.bind(this) )
		.on( 'attribute', function( name, body ) { 
			this.push( new tokens.AttributeToken( name, value ) );
		}.bind(this) );

	this.on( 'end', function() {
		this._sax.end();
	}.bind(this) );


}

util.inherits( XmlToTokens, Stream.Transform );

XmlToTokens.prototype._transform = function( chunk, encoding, cb ) {
	this._sax.write(chunk);
	cb();
};



function TokensToString() {
	stream.Transform.call(this, { writeableObjectMode: true } );
}

util.inherits( TokensToString, Stream.Transform );

XmlToTokens.prototype._transform = function( token, encoding, cb ) {	
	this.push( token.toString() );
	cb();
};

function TransformXML() {
	stream.Transform.call(this);
	this._xmlToTokens = new XmlToTokens();

	this._tokensToString = new TokensToString()
		.on( 'readable', function() {


		} );
}

util.inherits( TransformXML, Stream.Transform );

XmlToTokens.prototype._transform = function( chunk, encoding, cb ) {
	this._xmlToTokens.write(chunk);
};




