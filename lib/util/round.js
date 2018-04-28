"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = round;
function round(n, places) {
    return Number.parseFloat(n.toFixed(places));
};