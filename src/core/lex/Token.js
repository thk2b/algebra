class _Number {
    constructor(value){
        this.value = value;
    };
    print(){
        return this.value.toString();
    };
};

class UnaryOperation {
    constructor(name){
        this.name = name;
    };
};

class SquareRoot extends UnaryOperation {
    constructor(){
        super('sqrt');
    };
};
class Sin extends UnaryOperation {
    constructor(){
        super('sin');
    };
};
class Cos extends UnaryOperation {
    constructor(){
        super('cos');
    };
};
class Tan extends UnaryOperation {
    constructor(){
        super('tan');
    };
};

class BinaryOperation {
    constructor(operator, precedence){
        this.operator = operator;
        this.precedence = precedence;
        /* Signal that the operation is wrapped in parentheses.
         * This flag is set by the parser, not the lexer.
         */
        this.isParenthesized = null;
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
    UnaryOperation,
        SquareRoot, Sin, Cos, Tan,
    BinaryOperation,
        Addition, Substraction, Division, Multiplication, Exponentiation,
    OpenParenthesis, CloseParenthesis,
};
