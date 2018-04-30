export class MathError {
    constructor(token, message){
        this.token = token;
        const prefix = 'Math Error';
        this.message = message
            ? `${prefix}: ${message}`
            : prefix
        ;
    };
};

export class DivisionByZero extends MathError {
    constructor(divisionToken){
        super(divisionToken, 'Division by Zero');
    };
};

export default {
    MathError,
    DivisionByZero
};