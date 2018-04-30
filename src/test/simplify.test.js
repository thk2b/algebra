import test from 'tape';

import simplify from '../simplify';
import Errors from '../Errors';

function getError(fn){
    try {
        fn();
        return null;
    } catch(e){
        return e;
    };
};

test('/simplify', main => {
    /* Internals are throughly tested at simplifyTree.test.js */
    main.test('├─ basic operations', t => {
        t.deepEqual(simplify('1/2'), '1/2');
        t.deepEqual(simplify('20/40'), '1/2');
        t.deepEqual(simplify('1+2'), '3');
        t.deepEqual(simplify('1*2'), '2');
        t.deepEqual(simplify('1-2'), '-1');
        t.deepEqual(simplify('2^2'), '4');
        t.end();
    });
    main.test('├─ operations', t => {
        t.deepEqual(simplify('(6^2)/(5*3*2)'), '6/5');
        t.deepEqual(simplify('(10-3)/(5+9)'), '1/2');
        t.deepEqual(simplify('(15/5)/(100/10)'), '3/10');
        t.deepEqual(simplify('(8/7)(14/9)'), '16/9');
        t.end();
    });
    main.test('├ errors', t => {
        t.test('├─ unknown character', t => {
            const e = getError(() => simplify('1 @ 3'));
            t.equal(e.constructor, Errors.Character.UnknownCharacter);
            t.equal(e.message, 'Invalid character \'@\': Unknown character');
            t.end();
        });
        t.test('├─ missing number', t => {
            t.test('├── left of the operand', t => {
                const e = getError(() => simplify('+ 3'));
                t.equal(e.constructor, Errors.Syntax.MissingNumber);
                t.equal(e.message, 'Syntax Error: Invalid operation with operator \'+\': Missing number');
                t.end();
            });
            t.test('├── right of the operand', t => {
                const e = getError(() => simplify('3 +'));
                t.equal(e.constructor, Errors.Syntax.MissingNumber);
                t.equal(e.message, 'Syntax Error: Invalid operation with operator \'+\': Missing number');
                t.end();
            });
            t.test('├── either side of the operand', t => {
                const e = getError(() => simplify('+'));
                t.equal(e.constructor, Errors.Syntax.MissingNumber);
                t.equal(e.message, 'Syntax Error: Invalid operation with operator \'+\': Missing number');
                t.end();
            });

        });
        t.test('├─ empty expression', t => {
            t.test('├── in parentheses', t => {
                const e = getError(() => simplify('3 + ()'));
                t.equal(e.constructor, Errors.Syntax.EmptyExpression);
                t.equal(e.message, 'Syntax Error: Empty expression');
                t.end();
            });
            t.test('├── whole expression', t => {
                const e = getError(() => simplify(''));
                t.equal(e.constructor, Errors.Syntax.EmptyExpression);
                t.equal(e.message, 'Syntax Error: Empty expression');
                t.end();
            });
        });
        t.test('├─ unmatched parentheses', t => {
            t.test('├── no opening parenthesis', t => {
                const e = getError(() => simplify('5 + 5)'));
                t.equal(e.constructor, Errors.Syntax.UnmatchedParenthesis);
                t.equal(e.message, 'Syntax Error: Unmatched parenthesis');
                t.end();
            });
            t.test('├── no closing parenthesis', t => {
                const e = getError(() => simplify('((5 + 5)'));
                t.equal(e.constructor, Errors.Syntax.UnmatchedParenthesis);
                t.equal(e.message, 'Syntax Error: Unmatched parenthesis');
                t.end();
            });
        });
        t.test('├─ math', t => {
            t.test('├── division by 0', t => {
                const e = getError(() => simplify('5 / 0'));
                t.equal(e.constructor, Errors.Math.DivisionByZero);
                t.equal(e.message, 'Math Error: Division by Zero');
                t.end();
            });
        });
    });
});