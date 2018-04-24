export class _Number {
    constructor(value){
        this.value = value;
    };
    print(){
        return `Number(${this.value})`
    };
};

export class BinaryOperation {
    constructor(operator, precedence){
        this.operator = operator;
        this.precedence = precedence;
    };
    print(){
        return `Binary operation(${this.operator})`
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

export class OpenParenthesis {
    print(){ return 'Opening parenthesis' }
};
export class CloseParenthesis {
    print(){ return 'Closing parenthesis' }
};

export default {
    _Number,
    BinaryOperation,
    Addition, Substraction, Division, Multiplication,
    OpenParenthesis, CloseParenthesis,
}