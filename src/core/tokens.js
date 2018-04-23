class Token {
    constructor(){
        throw new Error('The Token class must be subclassed')
    }
    is(TokenType){
        return this instanceof TokenType
    }
}

export class _Number extends Token {
    constructor(value){
        this.value = value
    }
}
export class BinaryOperation extends Token {
    constructor(operator){
        this.operator = operator
    }
}
export class OpenParenthesis  extends Token { }
export class CloseParenthesis extends Token { }