class _Number {
    constructor(value){
        this.value = value;
    };
    print(){
        return this.value.toString();
    };
};

class BinaryOperation {
    constructor(operator, precedence){
        this.operator = operator;
        this.precedence = precedence;
    };
    print(){
        return this.operator;
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
    print(){ return '(' }
};

class CloseParenthesis {
    print(){ return ')' }
};

export default {
    _Number,
    BinaryOperation,
    Addition, Substraction, Division, Multiplication, Exponentiation,
    OpenParenthesis, CloseParenthesis,
};
