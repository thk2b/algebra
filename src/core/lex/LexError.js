export default class LexError {
    constructor(message, char){
        this.message = `invalid character:'${char}'`
    }
}