import test from 'tape';

import calculateTree from '../calculateTree';
import { lex, parse, Node, Token } from '../';

test('/calculateTree', main => {
    main.test('├ basic operations', t => {
        t.test('├─ with +', t => {
            const node = calculateTree(parse(lex('1 + 1'))); 
            t.ok(node instanceof Node);
            t.ok(node.value instanceof Token._Number);
            t.deepEqual(node.value, { value: 2 });
            t.end();
        });
        t.test('├─ with -', t => {
            const node = calculateTree(parse(lex('1 -10'))); 
            t.ok(node instanceof Node);
            t.ok(node.value instanceof Token._Number);
            t.deepEqual(node.value, { value: -9 });
            t.end();
        });
        t.test('├─ with *', t => {
            const node = calculateTree(parse(lex('2 * 10'))); 
            t.ok(node instanceof Node);
            t.ok(node.value instanceof Token._Number);
            t.deepEqual(node.value, { value: 20 });
            t.end();
        });
        t.test('├─ with /', t => {
            const node = calculateTree(parse(lex('10 / 2'))); 
            t.ok(node instanceof Node);
            t.ok(node.value instanceof Token._Number);
            t.deepEqual(node.value, { value: 5 });
            t.test('├── division by 0', t => {
                t.throws(
                    () => calculateTree(parse(lex('10/0')))
                );
                t.end();
            });
            t.end();
        });
        t.test('├─ with ^', t => {
            const node = calculateTree(parse(lex('10 ^ 2'))); 
            t.ok(node instanceof Node);
            t.ok(node.value instanceof Token._Number);
            t.deepEqual(node.value, { value: 100 });
            t.end();
        });
        t.test('├─ result should always be in the same precision as the most precise input', t => {
            t.equal(calculateTree(parse(lex('1.11111 + 0'))).value.value, 1.11111);
            t.end()
        });
    });
});