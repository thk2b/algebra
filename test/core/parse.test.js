import test from 'tape';

import Token from '../../src/core/Token'
import lex from '../../src/core/lex';
import Node from '../../src/core/Node';
import parse from '../../src/core/parse';

test('core/parse', main => {
    main.test('├ number', t => {
        const tokens = lex('1');
        const root = parse(tokens);
        t.ok(root instanceof Node);
        t.ok(root.value instanceof Token._Number);
        t.end();
    });
    main.test('├ whitespace', t => {
        const tokens = lex('1 ');
        const root = parse(tokens);
        t.ok(root instanceof Node);
        t.ok(root.value instanceof Token._Number);
        t.end();
    });
    // main.test('├ simple operations', t => {
    //     t.test('├─ addition', t => {
    //         const tokens = lex('1+2');
    //         const root = parse(tokens);
    //         t.ok(root instanceof Node);
    //         t.ok(root.value instanceof Token._Number);
    //         t.end();
    //     });
    // });
});