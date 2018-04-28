import test from 'tape';

import simplify from '../simplify';

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
        t.deepEqual(simplify('(10*20)/(5^5)'), '6/5');
        t.deepEqual(simplify('(5+9)/(10-3))'), '1/2');
        t.deepEqual(simplify('(15/5)/(100/10))'), '3/10');
        t.deepEqual(simplify('(8/7)(14/9)'), '16/9');
    });
});