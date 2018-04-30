export class MathError {
    constructor(token, message){
        this.token = token;
        const prefix = `Math Error at '${token.print()}'`;
        this.message = message
            ? `${prefix}: ${message}`
            : prefix
        ;
    };
};

export class DivisionByZero extends MathError {
    constructor(divisionToken){
        super(divisionToken);
    };
};

export default {
    MathError,
    DivisionByZero
};