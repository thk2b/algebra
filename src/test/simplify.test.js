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
        t.deepEqual(simplify('(6^2)/(5*3*2)'), '6/5');
        t.deepEqual(simplify('(10-3)/(5+9)'), '1/2');
        t.deepEqual(simplify('(15/5)/(100/10)'), '3/10');
        t.deepEqual(simplify('(8/7)(14/9)'), '16/9');
        t.end();
    });
});