var evalScheem = function(expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        return env[expr];
    }
    // Look at head of list for operation
    switch (expr[0]) {
    case '+':
        return evalScheem(expr[1], env) + evalScheem(expr[2], env);
    case '-':
        return evalScheem(expr[1], env) - evalScheem(expr[2], env);
    case '*':
        return evalScheem(expr[1], env) * evalScheem(expr[2], env);
    case '/':
        return evalScheem(expr[1], env) / evalScheem(expr[2], env);
    case 'quote':
        return expr[1];
    case '=':
        var eq = (evalScheem(expr[1], env) === evalScheem(expr[2], env));
        if (eq) return '#t';
        return '#f';
    case 'if':
        if (evalScheem(expr[1], env) === '#t') return evalScheem(expr[2]);
        return expr[3];
    case 'cons':
        var start = evalScheem(expr[1]);
        var finish = evalScheem(expr[2]);
        finish.unshift(start);
        return finish;
    case 'car':
        var first = evalScheem(expr[1]);
        return first[0];
    case 'cdr':
        var remaining = evalScheem(expr[1]);
        remaining.shift();
        return remaining;
    case '<':
        if (expr[1] < expr[2]) return '#t';
        return '#f';
    case 'set!':
        env[expr[1]] = evalScheem(expr[2], env);
        return 0;
    case 'define':
        env[expr[1]] = expr[2];
        return 0;
    case 'begin':
        var result;
        for (var i = 1; i < expr.length; i++) {
            result = evalScheem(expr[i], env);
        }
        return result;
    }
};

if (typeof module !== 'undefined') {
    var PEG = require('pegjs');
    var fs = require('fs');
    var parseScheem = PEG.buildParser(fs.readFileSync('scheem.peg', 'utf-8')).parse;
}

var evalScheemString = function(string, env) {
    return evalScheem(parseScheem(string), env);
};

// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
    module.exports.evalScheem = evalScheem;
    module.exports.evalScheemString = evalScheemString;
}