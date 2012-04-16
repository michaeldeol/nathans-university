var reverse = function(expr) {
    if (expr.tag === 'seq') {
        return {
            tag: 'seq',
            left: reverse(expr.right),
            right: reverse(expr.left)
        };
    } else {
        return expr;
    }
};

var test = { tag: 'seq',
  left: { tag: 'note', pitch: 'c4', dur: 250 },
  right:
   { tag: 'seq',
     left: { tag: 'note', pitch: 'e4', dur: 250 },
     right: { tag: 'note', pitch: 'g4', dur: 500 } 
    } 
};
  
console.log(reverse(test));​