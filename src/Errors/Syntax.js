export class SyntaxError {
    constructor(token, message){
        this.token = token;
        const prefix = 'Syntax Error:'
        if(message){
            this.message = `${prefix}: ${message}`;
        } else {
            this.message = prefix;
        };
    };
};

export class InvalidOperation extends SyntaxError {
    constructor(token, details){
        const prefix = `Invalid operation with operator '${token.operator}'`;
        if(details){
            super(token, `${prefix}: ${details}`)
        } else {
            super(token, prefix)
        };
    };
};

export class MissingNumber extends InvalidOperation {
    constructor(token){
        super(token, 'Missing number');
    };
};

export class EmptyExpression extends SyntaxError {
    constructor(token){
        super(token, 'Empty expression');
    };
};

export class UnmatchedParenthesis extends SyntaxError {
    constructor(token){
        super(token, 'Unmatched parenthesis');
    };
};


export default {
    SyntaxError,
    InvalidOperation,
    MissingNumber,
    EmptyExpression,
    UnmatchedParenthesis
};