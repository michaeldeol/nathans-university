if (typeof module !== 'undefined') {
    // In Node load required modules
    var assert = require('chai').assert;
    var PEG = require('pegjs');
    var fs = require('fs');
    var evalScheem = require('../scheem').evalScheem;
    var evalScheemString = require('../scheem').evalScheemString;
    var parseScheem = PEG.buildParser(fs.readFileSync('scheem.peg', 'utf-8')).parse;
} else {
    // In browser assume loaded by <script>
    var parseScheem = SCHEEM.parse;
    var assert = chai.assert;
}

suite('quote', function() {
    test('a number', function() {
        assert.deepEqual(
        evalScheem(['quote', 3], {}), 3);
    });
    test('an atom', function() {
        assert.deepEqual(
        evalScheem(['quote', 'dog'], {}), 'dog');
    });
    test('a list', function() {
        assert.deepEqual(
        evalScheem(['quote', [1, 2, 3]], {}), [1, 2, 3]);
    });
});

suite('set!/define', function() {
    test('set! a number', function() {
        assert.deepEqual(
        evalScheem(['set!', 'a', 3], { a: 1 }), 0);
    });
    test('define a number', function() {
        assert.deepEqual(
        evalScheem(['define', 'x', 7], {}), 0);
    });
});

suite('begin', function() {
    test('adding', function() {
        assert.deepEqual(
        evalScheem(['begin', ['+', 2, 2]], {}), 4);
    });
    test('xyx', function() {
        assert.deepEqual(
        evalScheem(['begin', 'x', 'y', 'x'], {x:1, y:2}), 1);
    });
});

suite('math', function() {
    test('addition', function() {
        assert.deepEqual(
        evalScheem(['+', 2, 2], {}), 4);
    });
    test('subtraction', function() {
        assert.deepEqual(
        evalScheem(['-', 7, 3], {}), 4);
    });
    test('multiply', function() {
        assert.deepEqual(
        evalScheem(['*', 3, 5], {}), 15);
    });
    test('divide', function() {
        assert.deepEqual(
        evalScheem(['/', 21, 3], {}), 7);
    });
});

suite('eq', function() {
    test('is equal', function() {
        assert.deepEqual(
        evalScheem(['=', 2, ['+', 1, 1]], {}), '#t');
    });
});

suite('<', function() {
    test('less than', function() {
        assert.deepEqual(
        evalScheem(['<', 8, 9], {}), '#t');
    });
});

suite('cons', function() {
    test('a list', function() {
        assert.deepEqual(
        evalScheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], {}), [[1, 2], 3, 4]);
    });
});

suite('car/cdr', function() {
    test('return first element', function() {
        assert.deepEqual(
        evalScheem(['car', ['quote', [[1, 2], 3, 4]]], {}), [1, 2]);
    });
    test('return remaining list', function() {
        assert.deepEqual(
        evalScheem(['cdr', ['quote', [[1, 2], 3, 4]]], {}), [3, 4]);
    });
});

suite('if', function() {
    test('true/false', function() {
        assert.deepEqual(
        evalScheem(['if', ['=', 1, 1], 2, 3], {}), 2);
    });
});

suite('eval string', function() {
    test('add', function() {
        assert.deepEqual(
        evalScheemString("(+ 1 2)", {}), 3);
    });
    test('begin', function() {
        assert.deepEqual(
        evalScheemString("(begin (define x 5) (+ x 2))", {}), 7);
    });
});