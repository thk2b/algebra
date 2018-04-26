class _Number {
    constructor(value){
        this.value = value;
    };
    print(){
        return `Number(${this.value})`
    };
};

class BinaryOperation {
    constructor(operator, precedence){
        this.operator = operator;
        this.precedence = precedence;
    };
    print(){
        return `Binary operation(${this.operator})`
    };
};
class Addition extends BinaryOperation {
    constructor(){ super('+', 0); };
};

class Substraction extends BinaryOperation {
    constructor(){ super('-', 0); };
};

class Division extends BinaryOperation {
    constructor(){ super('/', 1); };
};

class Multiplication extends BinaryOperation {
    constructor(){ super('*', 1); };
};

class Exponentiation extends BinaryOperation {
    constructor(){ super('^', 2); };
};

class OpenParenthesis {
    print(){ return 'Opening parenthesis' }
};
class CloseParenthesis {
    print(){ return 'Closing parenthesis' }
};

export default {
    _Number,
    BinaryOperation,
    Addition, Substraction, Division, Multiplication, Exponentiation,
    OpenParenthesis, CloseParenthesis,
}