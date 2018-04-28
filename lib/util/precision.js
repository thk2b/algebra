'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = precision;
function precision(n) {
    var places = n.toString().split('.')[1];
    return places ? places.length : 0;
};