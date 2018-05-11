import test from 'tape';

import { lex, parse, printTree } from '../';

test('core/printTree', main => {
    main.test('├ basic tree', t => {
        t.equal(
            printTree(parse(lex('1'))),
            '1'
        );
        t.equal(
            printTree(parse(lex('1+1'))),
            '1+1'
        );
        t.equal(
            printTree(parse(lex('1 + 1'))),
            '1+1'
        );
        t.equal(
            printTree(parse(lex('1-1'))),
            '1-1'
        );
        t.equal(
            printTree(parse(lex('2*1'))),
            '2*1'
        );
        t.equal(
            printTree(parse(lex('20/1'))),
            '20/1'
        );
        t.equal(
            printTree(parse(lex('20^1'))),
            '20^1'
        );
        t.equal(
            printTree(parse(lex(':sqrt(15)'))),
            'sqrt(15)'
        );
        t.end();
    });
    main.test('├ tree', t => {
        t.equal(
            printTree(parse(lex('(2)(2)'))),
            '2*2'
        );
        t.equal(
            printTree(parse(lex('(2+3)(5-4)'))),
            '(2+3)*(5-4)'
        );
        t.equal(
            printTree(parse(lex('(2+3)/(5-4)'))),
            '(2+3)/(5-4)'
        );
        t.equal(
            printTree(parse(lex('(2*3)^(5/4)'))),
            '(2*3)^(5/4)'
        );
        t.equal(
            printTree(parse(lex('((1--2)(2+3))(5-4)'))),
            '(1--2)*(2+3)*(5-4)'
        );
        t.equal(
            printTree(parse(lex('(1+4)/(6^10-4)(8/9(2+3))'))),
            '(1+4)/(6^10-4)*((8/9*(2+3))'
        );
        t.equal(
            printTree(parse(lex('(1+1)/(2+2)(3+3)'))),
            '(1+1)/(2+2)*(3+3)'
        );
        t.equal(
            printTree(parse(lex(':sqrt(5*5)'))),
            'sqrt(5*5)'
        );
        t.equal(
            printTree(parse(lex(':sqrt(5*5)+2'))),
            'sqrt(5*5)+2'
        );
        t.equal(
            printTree(parse(lex('1:sqrt(5*5)+2'))),
            '1*sqrt(5*5)+2'
        );
        t.end();
    });
    main.test('├ custom separator', t => {
        t.equal(
            printTree(parse(lex('20/1')), ' '),
            '20 / 1'
        );
        t.equal(
            printTree(parse(lex('(2+3)/(5-4)')), '_'),
            '(_2_+_3_)_/_(_5_-_4_)'
        );
        t.end();
    });
});
