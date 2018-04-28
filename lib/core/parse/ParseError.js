'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParseError = exports.ParseError = function ParseError(token) {
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Unexpected token: ';

    _classCallCheck(this, ParseError);

    this.message = message;
    this.token = token;
};

var InvalidOperation = exports.InvalidOperation = function (_ParseError) {
    _inherits(InvalidOperation, _ParseError);

    function InvalidOperation(token, details) {
        _classCallCheck(this, InvalidOperation);

        return _possibleConstructorReturn(this, (InvalidOperation.__proto__ || Object.getPrototypeOf(InvalidOperation)).call(this, token, 'Invalid operation: ' + token.operator + ': ' + details));
    }

    return InvalidOperation;
}(ParseError);

var MissingExpression = exports.MissingExpression = function (_ParseError2) {
    _inherits(MissingExpression, _ParseError2);

    function MissingExpression(token) {
        _classCallCheck(this, MissingExpression);

        return _possibleConstructorReturn(this, (MissingExpression.__proto__ || Object.getPrototypeOf(MissingExpression)).call(this, token, 'Expected Expression'));
    }

    return MissingExpression;
}(ParseError);

var UnmatchedParenthesis = exports.UnmatchedParenthesis = function (_ParseError3) {
    _inherits(UnmatchedParenthesis, _ParseError3);

    function UnmatchedParenthesis(token) {
        _classCallCheck(this, UnmatchedParenthesis);

        return _possibleConstructorReturn(this, (UnmatchedParenthesis.__proto__ || Object.getPrototypeOf(UnmatchedParenthesis)).call(this, token));
    }

    return UnmatchedParenthesis;
}(ParseError);

exports.default = {
    ParseError: ParseError,
    InvalidOperation: InvalidOperation,
    MissingExpression: MissingExpression,
    UnmatchedParenthesis: UnmatchedParenthesis
};