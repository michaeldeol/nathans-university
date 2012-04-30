var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('mus.peg', 'utf-8');

// Show the PEG grammar file
console.log(data);

// Create my parser
var parse = PEG.buildParser(data).parse;

// Do a test
assert.deepEqual( parse("a2[300] (a2[400])2  b4[400] r300"), {
   "tag": "par",
   "left": {
      "tag": "seq",
      "left": {
         "tag": "note",
         "pitch": "a2",
         "dur": "300"
      },
      "right": {
         "tag": "repeat",
         "section": {
            "tag": "note",
            "pitch": "a2",
            "dur": "400"
         },
         "count": "2"
      }
   },
   "right": {
      "tag": "seq",
      "left": {
         "tag": "note",
         "pitch": "b4",
         "dur": "400"
      },
      "right": {
         "tag": "rest",
         "duration": "300"
      }
   }
} );

assert.deepEqual( parse("a4[250] b4[250]  c4[500] d4[500]"), {
   "tag": "par",
   "left": {
      "tag": "seq",
      "left": {
         "tag": "note",
         "pitch": "a4",
         "dur": "250"
      },
      "right": {
         "tag": "note",
         "pitch": "b4",
         "dur": "250"
      }
   },
   "right": {
      "tag": "seq",
      "left": {
         "tag": "note",
         "pitch": "c4",
         "dur": "500"
      },
      "right": {
         "tag": "note",
         "pitch": "d4",
         "dur": "500"
      }
   }
} );
