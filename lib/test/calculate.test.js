'use strict';

var _tapeCatch = require('tape-catch');

var _tapeCatch2 = _interopRequireDefault(_tapeCatch);

var _calculate = require('../calculate');

var _calculate2 = _interopRequireDefault(_calculate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tapeCatch2.default)('/calculate', function (main) {
    main.test('├ basic operations', function (t) {
        t.test('├─ with +', function (t) {
            t.equal((0, _calculate2.default)('1 + 1'), 2, 'identity');
            t.equal((0, _calculate2.default)('1 + 10'), 11);
            t.equal((0, _calculate2.default)('1.54321 + 1'), 2.54321);
            t.end();
        });
        t.test('├─ with -', function (t) {
            t.equal((0, _calculate2.default)('1 - 1'), 0, 'identity');
            t.equal((0, _calculate2.default)('1 - 10'), -9);
            t.equal((0, _calculate2.default)('1.54321 - 1'), 0.54321);
            t.end();
        });
        t.test('├─ with *', function (t) {
            t.equal((0, _calculate2.default)('1 * 1'), 1, 'identity');
            t.equal((0, _calculate2.default)('1 * 10'), 10);
            t.equal((0, _calculate2.default)('2 * 11'), 22);
            t.equal((0, _calculate2.default)('1.54321 * 10'), 15.43210);
            t.end();
        });
        t.test('├─ with /', function (t) {
            t.equal((0, _calculate2.default)('1 / 1'), 1, 'identity');
            t.equal((0, _calculate2.default)('1 / 10'), 0.1);
            t.equal((0, _calculate2.default)('147 / 7'), 21);
            t.equal((0, _calculate2.default)('1.54321 / 10'), 0.15432);
            t.equal((0, _calculate2.default)('10 / 1.54321'), 6.48000);
            t.equal((0, _calculate2.default)('2/3'), 0.667, 'should be rounded to 3 decimal places by default');
            t.end();
            t.test('├── division by 0', function (t) {
                t.throws(function () {
                    return (0, _calculate2.default)('10/0');
                });
                t.end();
            });
        });
        t.test('├─ with ^', function (t) {
            t.equal((0, _calculate2.default)('2 ^ 2'), 4);
            t.end();
        });
        t.test('├─ result should always be in the same precision as the most precise input', function (t) {
            t.equal((0, _calculate2.default)('1.11111 + 0'), 1.11111);
            t.end();
        });
        t.test('├ operations', function (t) {
            t.equal((0, _calculate2.default)('1+2+3'), 6, '1');
            t.equal((0, _calculate2.default)('3-2-1'), 0, '2');
            t.equal((0, _calculate2.default)('1*2*3'), 6, '3');
            t.equal((0, _calculate2.default)('12/2/3'), 2, '4');
            t.equal((0, _calculate2.default)('(3)^(4)'), 81);
            t.equal((0, _calculate2.default)('2 ^ 2 ^ 2 ^ 2'), 256);
            t.equal((0, _calculate2.default)('2 ^ ( 2 ^ ( 2 ^ 2 ))'), 65536);
            t.equal((0, _calculate2.default)('-1+2'), 1, '1');
            t.equal((0, _calculate2.default)('-1+2-3+4-5+6+10'), 13, '1');
            t.equal((0, _calculate2.default)('-1-2'), -3, '1');
            t.equal((0, _calculate2.default)('-1*2'), -2, '1');
            t.equal((0, _calculate2.default)('20/-1'), -20);
            t.equal((0, _calculate2.default)('-4/1'), -4);
            t.equal((0, _calculate2.default)('10*-1'), -10);
            t.equal((0, _calculate2.default)('1.2345+2-3'), 0.2345, '1');
            t.equal((0, _calculate2.default)('3*5/5'), 3, '2');
            t.equal((0, _calculate2.default)('2*4+3.45'), 11.45, '3');
            t.equal((0, _calculate2.default)('1+2*4'), 9);
            t.equal((0, _calculate2.default)('1*2/1*2+1'), 5);
            t.equal((0, _calculate2.default)('1+2/-1'), -1);
            t.equal((0, _calculate2.default)('1+4/2'), 3);
            t.equal((0, _calculate2.default)('-4/-2'), 2);
            t.equal((0, _calculate2.default)('-4/-2(-4/(1-2))'), 8);
            t.equal((0, _calculate2.default)('2-4/-2'), 4);
            t.equal((0, _calculate2.default)('(1+5)*2'), 12);
            t.equal((0, _calculate2.default)('10-(-2*4)'), 18);
            t.equal((0, _calculate2.default)('10(5)'), 50);
            t.equal((0, _calculate2.default)('10(-5)'), -50);
            t.equal((0, _calculate2.default)('10-(-5)'), 15);
            t.equal((0, _calculate2.default)('10(2(1+2))-(-5)'), 65);
            t.equal((0, _calculate2.default)('10(2+2)'), 40);
            t.equal((0, _calculate2.default)('10(100)(1000)(-1)'), -1000000);
            t.equal((0, _calculate2.default)('2^(2+1)'), 8);
            t.equal((0, _calculate2.default)('2^2*10'), 40);
            t.equal((0, _calculate2.default)('10*2^2'), 40);
            t.equal((0, _calculate2.default)('2*2^(2+1)'), 16);
            t.equal((0, _calculate2.default)('5(10^2)(12-9)'), 1500);
            t.equal((0, _calculate2.default)('2/4/8'), 0.063);
            t.equal((0, _calculate2.default)('2/(4/8)'), 4);
            t.end();
        });
    });
});