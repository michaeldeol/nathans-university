var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');

// Show the PEG grammar file
console.log(data);

// Create my parser
var parse = PEG.buildParser(data).parse;

// Do a test
assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );
assert.deepEqual( parse("   \t \n (l m n o)"), ["l", "m", "n", "o"] );
assert.deepEqual( parse(" '(1 2 3) "), ["quote", ["1", "2", "3"]] );
assert.deepEqual( parse(";; This is a comment \n (roflcopter)"), ["roflcopter"] );