'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Number = function () {
    function _Number(value) {
        _classCallCheck(this, _Number);

        this.value = value;
    }

    _createClass(_Number, [{
        key: 'print',
        value: function print() {
            return this.value.toString();
        }
    }]);

    return _Number;
}();

;

var BinaryOperation = function () {
    function BinaryOperation(operator, precedence) {
        _classCallCheck(this, BinaryOperation);

        this.operator = operator;
        this.precedence = precedence;
    }

    _createClass(BinaryOperation, [{
        key: 'print',
        value: function print() {
            return this.operator;
        }
    }]);

    return BinaryOperation;
}();

;

var Addition = function (_BinaryOperation) {
    _inherits(Addition, _BinaryOperation);

    function Addition() {
        _classCallCheck(this, Addition);

        return _possibleConstructorReturn(this, (Addition.__proto__ || Object.getPrototypeOf(Addition)).call(this, '+', 0));
    }

    return Addition;
}(BinaryOperation);

;

var Substraction = function (_BinaryOperation2) {
    _inherits(Substraction, _BinaryOperation2);

    function Substraction() {
        _classCallCheck(this, Substraction);

        return _possibleConstructorReturn(this, (Substraction.__proto__ || Object.getPrototypeOf(Substraction)).call(this, '-', 0));
    }

    return Substraction;
}(BinaryOperation);

;

var Division = function (_BinaryOperation3) {
    _inherits(Division, _BinaryOperation3);

    function Division() {
        _classCallCheck(this, Division);

        return _possibleConstructorReturn(this, (Division.__proto__ || Object.getPrototypeOf(Division)).call(this, '/', 1));
    }

    return Division;
}(BinaryOperation);

;

var Multiplication = function (_BinaryOperation4) {
    _inherits(Multiplication, _BinaryOperation4);

    function Multiplication() {
        _classCallCheck(this, Multiplication);

        return _possibleConstructorReturn(this, (Multiplication.__proto__ || Object.getPrototypeOf(Multiplication)).call(this, '*', 1));
    }

    return Multiplication;
}(BinaryOperation);

;

var Exponentiation = function (_BinaryOperation5) {
    _inherits(Exponentiation, _BinaryOperation5);

    function Exponentiation() {
        _classCallCheck(this, Exponentiation);

        return _possibleConstructorReturn(this, (Exponentiation.__proto__ || Object.getPrototypeOf(Exponentiation)).call(this, '^', 2));
    }

    return Exponentiation;
}(BinaryOperation);

;

var OpenParenthesis = function () {
    function OpenParenthesis() {
        _classCallCheck(this, OpenParenthesis);
    }

    _createClass(OpenParenthesis, [{
        key: 'print',
        value: function print() {
            return '(';
        }
    }]);

    return OpenParenthesis;
}();

;

var CloseParenthesis = function () {
    function CloseParenthesis() {
        _classCallCheck(this, CloseParenthesis);
    }

    _createClass(CloseParenthesis, [{
        key: 'print',
        value: function print() {
            return ')';
        }
    }]);

    return CloseParenthesis;
}();

;

exports.default = {
    _Number: _Number,
    BinaryOperation: BinaryOperation,
    Addition: Addition, Substraction: Substraction, Division: Division, Multiplication: Multiplication, Exponentiation: Exponentiation,
    OpenParenthesis: OpenParenthesis, CloseParenthesis: CloseParenthesis
};