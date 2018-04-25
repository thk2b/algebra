import test from 'tape-catch';

import round from '../round';

test('util/round', t => {
    t.equal(round(1, 0), 1, '1');
    t.equal(round(1, 2), 1, '2');
    t.equal(round(1.9, 0), 2, '2.1');
    t.equal(round(1.5, 1), 1.5, '3');
    t.equal(round(1.56, 1), 1.6, 'should round up when last decimal place is > 5');
    t.equal(round(1.55, 1), 1.6, 'should round up when last decimal place is === 5');
    t.equal(round(1.44, 1), 1.4, 'should round down when last decimal place is < 5');
    t.equal(round(1.99991, 1), 2, '4');
    t.equal(round(1.55554, 1), 1.6, '5');
    t.end();
});