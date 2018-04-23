export default class Node {
    constructor(value, left, right){
        this.value = value;
        this.left = left;
        this.right = right;
        return this;
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
            this.left = node;
        } else if (this.right === undefined){
            this.left = node;
        } else {
            throw new Error('A node cannot have more than two children.');
        };
        return this;
    };
    addLeaf(node){
        for(let node of this.nodes()){
            if(node.left !== undefined && node.right === undefined){
                return node;
            };
        };
        return this.add(node);
    };
    insertRight(node){
        node.add(this.right);
        this.right = node;
        return node;
    };
    insertLeft(node){
        node.add(this.left);
        this.left = node;
        return node;
    };
    *nodes(){

    }
    *[Symbol.iterator](){
        if(this.left !== undefined){
            yield *this.left;
            yield this.left;
        };
        if(this.right !== undefined){
            if(this.right instanceof Node){
                yield *this.right;
            };
            yield this.right;
        };
    };
};