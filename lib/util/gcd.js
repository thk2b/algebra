'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = gcd;
var min = Math.min,
    max = Math.max,
    abs = Math.abs;


function _gcd(a, b) {
    if (b === 0) return a;
    return _gcd(b, a % b);
};

function gcd(a, b) {
    if (a === 0 || b === 0) {
        throw new Error('Cannot find divisors of 0');
    };
    return _gcd(abs(a), abs(b));
};