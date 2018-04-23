export class _Number {
    constructor(value){
        this.value = value;
    };
};
export class BinaryOperation {
    constructor(operator, precedence){
        this.operator = operator;
        this.precedence = precedence;
    };
};
export class Addition extends BinaryOperation {
    constructor(){ super('+', 0); };
};
export class Substraction extends BinaryOperation {
    constructor(){ super('-', 0); };
};
export class Division extends BinaryOperation {
    constructor(){ super('/', 1); };
};
export class Multiplication extends BinaryOperation {
    constructor(){ super('*', 1); };
};

export class OpenParenthesis { };
export class CloseParenthesis { };

export default {
    _Number,
    Addition, Substraction, Division, Multiplication,
    OpenParenthesis, CloseParenthesis,
}