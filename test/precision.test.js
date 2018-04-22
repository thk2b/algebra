import test from 'tape';

import precision from '../src/util/precision';

test('│precision', t => {
    t.equal(precision(1), 0)
    t.equal(precision(1.1), 1)
    t.equal(precision(1.11), 2)
    t.equal(precision(1.111), 3)
    t.equal(precision(1.1111), 4)
    /*...*/
    t.end()
})