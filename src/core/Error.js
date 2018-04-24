export class ParseError {
    constructor(token, message='Unexpected token: '){
        this.message = message
        this.token = token
    }
}

export class InvalidOperation extends ParseError {
    constructor(token, details){
        super(token, `Invalid operation: ${token.operator}: ${details}`)
    }
}
export class MissingExpression extends ParseError {
    constructor(token){
        super(token, 'Expected Expression')
    }
}

export class UnmatchedParenthesis extends ParseError {
    constructor(token){
        super(token)
    }
}


export default {
    ParseError,
    InvalidOperation,
    MissingExpression,
    UnmatchedParenthesis
}