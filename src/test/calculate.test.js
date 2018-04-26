import test from 'tape-catch';

import calculate from '../calculate';

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
        });
        t.test('├─ result should always be in the same precision as the most precise input', t => {
            t.equal(calculate('1.11111 + 0'), 1.11111)
            t.end()
        });
    });
    main.test('├ operations', t => {
        t.test('├─ with multiple times the same operand', t => {
            t.equal(calculate('1+2+3'), 6, '1');
            t.equal(calculate('3-2-1'), 0, '2');
            t.equal(calculate('1*2*3'), 6, '3');
            t.equal(calculate('12/2/3'), 2, '4');
            t.end();
        });
        t.test('├─ with multiple mixed operands', t => {
            t.equal(calculate('-1+2'), 1, '1');
            t.equal(calculate('-1+2-3+4-5+6+10'), 13, '1');
            t.equal(calculate('-1-2'), -3, '1');
            t.equal(calculate('-1*2'), -2, '1');
            t.equal(calculate('20/-1'), -20);
            t.equal(calculate('-4/1'), -4);
            t.equal(calculate('10*-1'), -10);
            t.equal(calculate('1.2345+2-3'), 0.2345, '1');
            t.equal(calculate('3*5/5'), 3, '2');
            t.equal(calculate('2*4+3.45'), 11.45, '3');
            t.end();
        });
        t.test('├─ respects the order of operations', t => {
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
            t.end();
        });
        t.test('├─ division by 0', t => {
            t.throws(
                () => calculate('10/0')
            );
            t.end();
        })
    });
});