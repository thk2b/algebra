export default class Node {
    constructor(value, left, right){
        this.value = value;
        this.left = left && this._validate(left);
        this.right = right && this._validate(right);
        return this;
    };
    _validate(node){
        if(node instanceof Node){
            return node;
        };
        throw new TypeError(`Invalid Node: ${node}`);
    };
    get count(){
        return [this.right, this.left].reduce(
            (count, child) => child === undefined ? count : count + 1
        , 0);
    };
    set(value){
        this.value = value;
        return this;
    };
    add(node){
        if(this.left === undefined){
            this.left = this._validate(node);
        } else if (this.right === undefined){
            this.right = this._validate(node);
        } else {
            throw new Error(`A node cannot have more than two children: you tried adding ${node} to ${this}`);
        };
        return this;
    };
    insertRight(node){
        this._validate(node).add(this.right);
        this.right = node;
        return node;
    };
    insertLeft(node){
        this._validate(node).add(this.left);
        this.left = node;
        return node;
    };
    *walk(){
        yield this.value;
        if(this.left !== undefined){
            yield *this.left;
        };
        if(this.right !== undefined){
            yield *this.right;
        };
    }
    *[Symbol.iterator](){
        yield* this.walk();
    };
};
