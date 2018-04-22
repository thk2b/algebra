import test from 'tape';

import calculate from '../src';

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
            t.equal(calculate('1.54321 * 10'), 15.4321);
            t.end();
        });
        t.test('├─ with /', t => {
            t.equal(calculate('1 / 1'), 1, 'identity');
            t.equal(calculate('1 / 10'), 0.1);
            t.equal(calculate('147 / 7'), 21);
            t.equal(calculate('1.54321 / 10'), 0.154321);
            t.end();
        });
        t.test('├─ with %', t => {
            t.equal(calculate('1 % 1'), 0, 'identity');
            t.equal(calculate('1 % 10'), 1);
            t.equal(calculate('123 % 12'), 3);
            t.equal(calculate('15.4321 % 4'), 3.4321);
            t.end();
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
            t.equal(calculate('12/2/1.5'), 4, '4');
            t.end();
        });
    });
});