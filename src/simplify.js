import { lex, parse, simplifyTree, printTree } from './core';

export default function(expression){
    return printTree(
        simplifyTree(parse(lex(expression)))
    );
};