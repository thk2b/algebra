"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LexError = function LexError(message, char) {
    _classCallCheck(this, LexError);

    this.message = "invalid character:'" + char + "'";
};

exports.default = LexError;