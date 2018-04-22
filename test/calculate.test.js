import test from 'tape';

import calculate from '../src/calculate';

test('│calculate', main => {
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
        t.test('├─ with %', t => {
            t.equal(calculate('1 % 1'), 0, 'identity');
            t.equal(calculate('1 % 10'), 1);
            t.equal(calculate('123 % 12'), 3);
            t.equal(calculate('15.4321 % 4'), 3.4321);
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
            t.equal(calculate('1.2345+2-3'), 0.2345, '1');
            t.equal(calculate('3*5/5'), 3, '2');
            t.equal(calculate('2*4+3.45'), 11.45, '3');
            t.end();
        });
        t.test('├─ respects the order of operations', t => {
            t.equal(calculate('1+2*4'), 13)
            t.equal(calculate('10-(-2*4)'), 18)
            t.equal(calculate('1+4/2'), 3)
            t.equal(calculate('1-4/2'), -1)
            t.equal(calculate('(1+5)*2', 12))
            t.end()
        });
    });
});