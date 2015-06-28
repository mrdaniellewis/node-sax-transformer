# Node SAX XML Transformer

Transform an XML document using SAX.

This is XML transformer based on the "node sax parser"[https://www.npmjs.com/package/sax].

```js
var Transform = require( 'sax-transformer' );

var transform = Transform()
	.on( 'opentag', function( ob, callback ) {
		ob.name = 'bar';
		callback();
	} );

transform.end('<foo>text</foo>');

// transforms to => "<bar>test</bar>"
```

## `Transform( strict, options )`

Create a new transform stream (without or without the new operator).

`strict` and `options` are passed on to "sax"[https://www.npmjs.com/package/sax]. See there for a reference.  However **`lowercase`** is ser `true` by default.

### Events

Each event has a token and a callback as arguments.  The stream will not continue until you call the callback.

You can modify the token and those modifications will be used to generate the finished XML.

If the callback is called `null` or `false` that token will be included in the final XML.  No validation will take place on your modifications.

To add additional XML use `this.push` to push new tokens.

If the callback is called with a token that token will replace the current token.

The tokens can be found on `Transform.tokens` and are:

**`text`** - Text node. Properties: `text`

**`doctype`** - The <!DOCTYPE declaration. Properties: `doctype`

**`processinginstruction`** - A processing instruction. Properties: `name` and `body`

**`opentag`** - An opening tag. Properties: `name`, `attributes` and `isSelfClosing`

**`closetag`**` - A closing tag. Properties: `name`

**`comment`** - A comment node. Properties: `text`

**`opencdata`** - The opening tag of a <![CDATA[ block.

**`cdata`** - The text of a <![CDATA[ block. Propeties `text`

**`closecdata`** - The closing tag (]]>) of a <![CDATA[ block.

**`script`** - The text of a script (in non-strict mode). Properties `text`