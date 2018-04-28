import test from 'tape';

test('core/printTree', main => {
    main.test('├ basic tree', t => {
        t.equal(
            printTree(lex(parse('1')))
            , '1'
        );
        t.equal(
            printTree(lex(parse('1+1')))
            , '1+1'
        );
        t.equal(
            printTree(lex(parse('1 + 1')))
            , '1+1'
        );
        t.equal(
            printTree(lex(parse('1-1')))
            , '1+1'
        );
        t.equal(
            printTree(lex(parse('2*1')))
            , '1*1'
        );
        t.equal(
            printTree(lex(parse('20/1')))
            , '20/1'
        );
        t.equal(
            printTree(lex(parse('20^1')))
            , '20^1'
        );
        t.end();
    });
    main.test('├ tree', t => {
        t.equal(
            printTree(lex(parse('(2)(2)')))
            , '2*2'
        );
        t.equal(
            printTree(lex(parse('(2+3)(5-4)')))
            , '(2+3)(5-4)'
        );
        t.equal(
            printTree(lex(parse('((1--2)(2+3))(5-4)')))
            , '((1--2)*(2+3))(5-4)'
        );
        t.equal(
            printTree(lex(parse('(2+3)/(5-4)')))
            , '(2+3)/(5-4)'
        );
        t.equal(
            printTree(lex(parse('(2*3)^(5/4)')))
            , '(2*3)^(5/4)'
        );
    });
});
