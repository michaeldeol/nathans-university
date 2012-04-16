var endTime = function (time, expr) {
    if (expr.tag === 'par') {
        return time += Math.max(expr.left.dur, expr.right.dur);
    } else if (expr.tag === 'note' || expr.tag === 'repeat') {
        return time + expr.dur;
    } else if (expr.tag === 'rest') {
        return time + expr.duration;
    } else {
        return endTime(endTime(time, expr.left), expr.right);
    }
};

var convertPitch = function (pitch) {
    var letter = { a: 9, b: 11, c: 0, d: 2, e: 4, f: 5, g: 7 },
        letterPitch,
        octave;
    if (pitch.length !== 2) {
        throw new Error("Invalid Pitch: " + pitch);
        return;
    } else {
        letterPitch = pitch.toLowerCase().charAt(0);
        octave = pitch.charAt(1);
    }
    return (12 + 12 * octave + letter[letterPitch]);
};

var getNote = function (expr, time, note) {
    if (expr.tag === 'note') {
        expr.start = time;
        note.push({ tag: expr.tag, pitch: convertPitch(expr.pitch), start: expr.start, dur: expr.dur });
        return expr;
    }
    if (expr.tag === 'seq') {
        getNote(expr.left, time, note);
        getNote(expr.right, endTime(time, expr.left), note);
    }
    if (expr.tag === 'par') {
        getNote(expr.left, time, note);
        getNote(expr.right, time, note);
    }
    if (expr.tag === 'repeat') {
        var prevtime;
        for (var i = 0; i < expr.count; i++) {
            if (i === 0) {
                prevTime = time;
            } else {
                prevTime += expr.section.dur;
            }
            getNote(expr.section, prevTime, note);
        }
    }
};

var compile = function (musexpr) {
    var note = [];
    getNote(musexpr, 0 , note);
    return note;
};

var melody_mus = {
    tag: 'seq',
    left: {
        tag: 'seq',
        left: { tag: 'note', pitch: 'a4', dur: 250 },
        right: { tag: 'note', pitch: 'b4', dur: 250 }
    },
    right: {
        tag: 'seq',
        left: { tag: 'note', pitch: 'c4', dur: 500 },
        right: { tag: 'note', pitch: 'd4', dur: 500 }
    }
};

var melody_rest_mus = {
    tag: 'seq',
    left: {
        tag: 'seq',
        left: { tag: 'rest', duration: 100  },
        right: { tag: 'note', pitch: 'b4', dur: 250 }
    },
    right: {
        tag: 'seq',
        left: { tag: 'note', pitch: 'c4', dur: 500 },
        right: { tag: 'note', pitch: 'd4', dur: 500 }
    }
};

var melody_rest_repeat_mus = {
    tag: 'seq',
    left: {
        tag: 'seq',
        left: { tag: 'rest', duration: 100  },
        right: { tag: 'note', pitch: 'b4', dur: 250 }
    },
    right: {
        tag: 'repeat',
        section: { tag: 'note', pitch: 'c4', dur: 250 },
        count: 3
    },
};

console.log(melody_rest_repeat_mus);
console.log(compile(melody_rest_repeat_mus));