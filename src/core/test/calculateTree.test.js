import test from 'tape';

import calculateTree, { CalculationError } from '../calculateTree';
import { lex, parse, Node, Token } from '../';
import Errors from '../../Errors'

test('core/calculateTree', main => {
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
                    () => calculateTree(parse(lex('10/0'))),
                    Errors.Math.DivisionByZero
                );
                t.end();
            });
            t.end();
        });
        t.test('├─ with :sqrt', t => {
            const node = calculateTree(parse(lex(':sqrt(25)'))); 
            t.ok(node instanceof Node);
            t.ok(node.value instanceof Token._Number);
            t.deepEqual(node.value, { value: 5 });
            t.end();
        });
        t.test('├─ with :cos', t => {
            const node = calculateTree(parse(lex(':cos(25)'))); 
            t.ok(node instanceof Node);
            t.ok(node.value instanceof Token._Number);
            t.deepEqual(node.value, { value: 0.991 });
            t.end();
        });
        t.test('├─ with :sin', t => {
            const node = calculateTree(parse(lex(':sin(25)'))); 
            t.ok(node instanceof Node);
            t.ok(node.value instanceof Token._Number);
            t.deepEqual(node.value, { value: -0.132 });
            t.end();
        });
        t.test('├─ with :tan', t => {
            const node = calculateTree(parse(lex(':tan(25)'))); 
            t.ok(node instanceof Node);
            t.ok(node.value instanceof Token._Number);
            t.deepEqual(node.value, { value: -0.134 });
            t.end();
        });
        t.test('├─ nested operation', t => {
            const node = calculateTree(parse(lex('10 / 2 + :sqrt(25)'))); 
            t.ok(node instanceof Node);
            t.ok(node.value instanceof Token._Number);
            t.deepEqual(node.value, { value: 10 });
            t.end();
        })
        t.test('├─ invalid operation', t => {
            t.throws(
                () => calculateTree(
                    new Node(new Token.OpenParenthesis(), 
                        new Node(new Token._Number(1)), 
                        new Node(new Token._Number(1))
                    )
                ),
                TypeError
            );
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
        t.test('├── rounding', t => {
            t.equal(calculateTree(parse(lex('2/3'))).value.value, 0.667, 'division should be rounded to 3 decimal places by default');
            t.end();
        });
        t.test('├── precision', t => {
            t.equal(calculateTree(parse(lex('1.11111 + 0'))).value.value, 1.11111, 'should be in the same precision as the most precise input');
            t.end();
        });
    });
});