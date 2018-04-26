import test from 'tape-catch';

import gcd from '../gcd';

test('/util/gcd', t => {
    t.equal(gcd(1, 1), 1);
    t.equal(gcd(2, 4), 2);
    t.equal(gcd(20, 40), 20);
    t.equal(gcd(20, 41), 1);
    t.equal(gcd(2, 1), 1);
    t.equal(gcd(-15, 5), 5);
    t.equal(gcd(-15, -5), 5);
    t.throws(() => gcd(1, 0));
    t.throws(() => gcd(0, 0));
    t.end();
})