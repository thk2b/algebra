import test from 'tape-catch';

import calculate from '../calculate';
import Errors from '../Errors';

function getError(fn){
    try {
        fn();
        return null;
    } catch(e){
        return e;
    };
};

test('/calculate', main => {
    main.test('├ basic operations', t => {
        t.test('├─ with +', t => {
            t.equal(calculate('1 + 1'), 2, 'identity');
            t.equal(calculate('1 + 10'), 11);
            t.equal(calculate('1.54321 + 1'), 2.54321);
            t.end();
        });
        t.test('├─ with -', t => {
            t.equal(calculate('1 - 1'), 0, 'identity');
            t.equal(calculate('1 - 10'), -9);
            t.equal(calculate('1.54321 - 1'), 0.54321);
            t.end();
        });
        t.test('├─ with *', t => {
            t.equal(calculate('1 * 1'), 1, 'identity');
            t.equal(calculate('1 * 10'), 10);
            t.equal(calculate('2 * 11'), 22);
            t.equal(calculate('1.54321 * 10'), 15.43210);
            t.end();
        });
        t.test('├─ with /', t => {
            t.equal(calculate('1 / 1'), 1, 'identity');
            t.equal(calculate('1 / 10'), 0.1);
            t.equal(calculate('147 / 7'), 21);
            t.equal(calculate('1.54321 / 10'), 0.15432);
            t.equal(calculate('10 / 1.54321'), 6.48000);
            t.equal(calculate('2/3'), 0.667, 'should be rounded to 3 decimal places by default');
            t.end();
            t.test('├── division by 0', t => {
                t.throws(
                    () => calculate('10/0')
                );
                t.end();
            })
        });
        t.test('├─ with ^', t => {
            t.equal(calculate('2 ^ 2'), 4);
            t.end();
        });
        t.test('├─ result should always be in the same precision as the most precise input', t => {
            t.equal(calculate('1.11111 + 0'), 1.11111)
            t.end()
        });
    });
    main.test('├ operations', t => {
        t.equal(calculate('1+2+3'), 6);
        t.equal(calculate('3-2-1'), 0);
        t.equal(calculate('1*2*3'), 6);
        t.equal(calculate('12/2/3'), 2);
        t.equal(calculate('(3)^(4)'), 81);
        t.equal(calculate('2 ^ 2 ^ 2 ^ 2'), 256);
        t.equal(calculate('2 ^ ( 2 ^ ( 2 ^ 2 ))'), 65536);
        t.equal(calculate('-1+2'), 1, '1');
        t.equal(calculate('-1+2-3+4-5+6+10'), 13);
        t.equal(calculate('-1-2'), -3, '1');
        t.equal(calculate('-1*2'), -2, '1');
        t.equal(calculate('20/-1'), -20);
        t.equal(calculate('-4/1'), -4);
        t.equal(calculate('10*-1'), -10);
        t.equal(calculate('1.2345+2-3'), 0.2345);
        t.equal(calculate('3*5/5'), 3, '2');
        t.equal(calculate('2*4+3.45'), 11.45);
        t.equal(calculate('1+2*4'), 9);
        t.equal(calculate('1*2/1*2+1'), 5);
        t.equal(calculate('1+2/-1'), -1);
        t.equal(calculate('1+4/2'), 3);
        t.equal(calculate('-4/-2'), 2);
        t.equal(calculate('-4/-2(-4/(1-2))'), 8);
        t.equal(calculate('2-4/-2'), 4);
        t.equal(calculate('(1+5)*2'), 12);
        t.equal(calculate('10-(-2*4)'), 18);
        t.equal(calculate('10(5)'), 50);
        t.equal(calculate('10(-5)'), -50);
        t.equal(calculate('10-(-5)'), 15);
        t.equal(calculate('10(2(1+2))-(-5)'), 65);
        t.equal(calculate('10(2+2)'), 40);
        t.equal(calculate('10(100)(1000)(-1)'), -1000000);
        t.equal(calculate('2^(2+1)'), 8);
        t.equal(calculate('2^2*10'), 40);
        t.equal(calculate('10*2^2'), 40);
        t.equal(calculate('2*2^(2+1)'), 16);
        t.equal(calculate('5(10^2)(12-9)'), 1500);
        t.equal(calculate('2/4/8'), 0.063);
        t.equal(calculate('2/(4/8)'), 4);
        t.end();
    });
    main.test('├ errors', t => {
        t.test('├─ unknown character', t => {
            const e = getError(() => calculate('1 @ 3'));
            t.equal(e.constructor, Errors.Character.UnknownCharacter);
            t.equal(e.message, 'Invalid character \'@\': Unknown character');
            t.end();
        });
        t.test('├─ missing number', t => {
            t.test('├── left of the operand', t => {
                const e = getError(() => calculate('+ 3'));
                t.equal(e.constructor, Errors.Syntax.MissingNumber);
                t.equal(e.message, 'Syntax Error: Invalid operation with operator \'+\': Missing number');
                t.end();
            });
            t.test('├── right of the operand', t => {
                const e = getError(() => calculate('3 +'));
                t.equal(e.constructor, Errors.Syntax.MissingNumber);
                t.equal(e.message, 'Syntax Error: Invalid operation with operator \'+\': Missing number');
                t.end();
            });
            t.test('├── either side of the operand', t => {
                const e = getError(() => calculate('+'));
                t.equal(e.constructor, Errors.Syntax.MissingNumber);
                t.equal(e.message, 'Syntax Error: Invalid operation with operator \'+\': Missing number');
                t.end();
            });

        });
        t.test('├─ empty expression', t => {
            t.test('├── in parentheses', t => {
                const e = getError(() => calculate('3 + ()'));
                t.equal(e.constructor, Errors.Syntax.EmptyExpression);
                t.equal(e.message, 'Syntax Error: Empty expression');
                t.end();
            });
            t.test('├── whole expression', t => {
                const e = getError(() => calculate(''));
                t.equal(e.constructor, Errors.Syntax.EmptyExpression);
                t.equal(e.message, 'Syntax Error: Empty expression');
                t.end();
            });
        });
        t.test('├─ unmatched parentheses', t => {
            t.test('├── no opening parenthesis', t => {
                const e = getError(() => calculate('5 + 5)'));
                t.equal(e.constructor, Errors.Syntax.UnmatchedParenthesis);
                t.equal(e.message, 'Syntax Error: Unmatched parenthesis');
                t.end();
            });
            t.test('├── no closing parenthesis', t => {
                const e = getError(() => calculate('((5 + 5)'));
                t.equal(e.constructor, Errors.Syntax.UnmatchedParenthesis);
                t.equal(e.message, 'Syntax Error: Unmatched parenthesis');
                t.end();
            });
        });
        t.test('├─ math', t => {
            t.test('├── division by 0', t => {
                const e = getError(() => calculate('5 / 0'));
                t.equal(e.constructor, Errors.Math.DivisionByZero);
                t.equal(e.message, 'Math Error: Division by Zero');
                t.end();
            });
        });
    });
});