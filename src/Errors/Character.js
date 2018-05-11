export class CharacterError {
    constructor(char, message){
        this.char = char;
        const prefix = `Invalid character '${char}'`;
        if(message){
            this.message = `${prefix}: ${message}`;
        } else {
            this.message = prefix;
        };
    };
};

export class UnknownCharacter extends CharacterError {
    constructor(char){
        super(char, 'Unknown character');
    };
};
export class InvalidNumber extends CharacterError {
    constructor(char){
        super(char, 'Invalid number');
    };
};

export class InvalidOperator extends CharacterError {
    constructor(char){
        super(char, 'Invalid operator');
    };
};

export default {
    CharacterError,
    UnknownCharacter,
    InvalidNumber,
    InvalidOperator
};