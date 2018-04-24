import test from 'tape-catch';

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
    main.test('├ negative number', t => {
        const tokens = lex('-1');
        const root = parse(tokens);
        const walk = Arary.from(root);
        t.deepEqual(walk, [
            { operator: '*', precedence: 1 },
            { value: -1 },
            { value: 1 },
        ])
        t.ok(root instanceof Node);
        t.ok(root.value instanceof Token._Number);
        t.end();
    });

    main.test('├ simple expressions', t => {
        t.test('├─ addition', t => {
            const tokens = lex('10 + 2.5');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Addition);
            t.ok(root.left.value instanceof Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
        t.test('├─ substraction', t => {
            const tokens = lex('10 - 2.5');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Substraction);
            t.ok(root.left.value instanceof Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
        t.test('├─ multiplication', t => {
            const tokens = lex('10 * 2.5');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Multiplication);
            t.ok(root.left.value instanceof Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
        t.test('├─ division', t => {
            const tokens = lex('10 / 2.5');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Division);
            t.ok(root.left.value instanceof Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
    });

    main.test('├ complex expressions', t => {
        t.test('├─ a + b + c', t => {
            const root = parse(lex('1 + 20 + 3.5'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0 },
                { operator: '+', precedence: 0 },
                { value: 1 },
                { value: 20 },
                { value: 3.5 }
            ])
            t.end()
        });
        t.test('├─ a + b + c - d - e', t => {
            const root = parse(lex('1 + 20 + 3.5 - 4 - 5'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '-', precedence: 0 },
                { operator: '-', precedence: 0 },
                { operator: '+', precedence: 0 },
                { operator: '+', precedence: 0 },
                { value: 1 },
                { value: 20 },
                { value: 3.5 },
                { value: 4 },
                { value: 5 },
            ])
            t.end()
        });
        t.test('├─ a * b + c ', t => {
            const root = parse(lex('1 * 20 + 3.5'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0 },
                { operator: '*', precedence: 1 },
                { value: 1 },
                { value: 20 },
                { value: 3.5 }
            ])
            t.end()
        });
        t.test('├─ a + b * c ', t => {
            const root = parse(lex('1 + 20 * 3.5'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0 },
                { value: 1 },
                { operator: '*', precedence: 1 },
                { value: 20 },
                { value: 3.5 }
            ])
            t.end()
        });
        t.test('├─ a + b * c - e / f', t => {
            const root = parse(lex('1 + 20 * 3.5 - 4 / 5'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '-', precedence: 0 },
                { operator: '+', precedence: 0 },
                { value: 1 },
                { operator: '*', precedence: 1 },
                { value: 20 },
                { value: 3.5 },
                { operator: '/', precedence: 1 },
                { value: 4 },
                { value: 5 },
            ])
            t.end()
        });
    });
    
    main.test('├ expressions with parentheses', t => {
        t.test('├─ a + (b + c)', t => {
            const root = parse(lex('1 + (20 + 3.5)'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0 },
                { value: 1 },
                { operator: '+', precedence: 1 },
                { value: 20 },
                { value: 3.5 }
            ])
            t.end()
        });
        t.test('├─ (a + b) * c ', t => {
            const root = parse(lex('(1 + 20) * 3.5'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '*', precedence: 1 },
                { operator: '+', precedence: 1 },
                { value: 1 },
                { value: 20 },
                { value: 3.5 }
            ])
            t.end()
        });
        t.test('├─ a + (b + (c + d))', t => {
            const root = parse(lex('1 + (2 + (3 + 4))'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0 },
                { value: 1 },
                { operator: '+', precedence: 1 },
                { value: 2 },
                { operator: '+', precedence: 1 },
                { value: 3 },
                { value: 4 },
            ])
            t.end()
        });
        t.test('├─ a + (b + (c - (d - e)))', t => {
            const root = parse(lex('1 + (20 + (3.5 - (4 - 5)))'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0 },
                { value: 1 },
                { operator: '+', precedence: 1 },
                { value: 20 },
                { operator: '-', precedence: 1 },
                { value: 3.5 },
                { operator: '-', precedence: 1 },
                { value: 4 },
                { value: 5 },
            ])
            t.end()
        });
        t.test('├─ a + (b + c) * d', t => {
            const root = parse(lex('0 + (1 + 20) * 3.5'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0 },
                { value: 0 },
                { operator: '*', precedence: 1 },
                { operator: '+', precedence: 1 },
                { value: 1 },
                { value: 20 },
                { value: 3.5 }
            ])
            t.end()
        });
        t.test('├─ a + ( b * ( c + ( d - e )) * f )', t => {
            const root = parse(lex('1+(2*(3+(4-5))*6)'));
            const walk = Array.from(root)
            t.deepEqual(walk, [
                { operator: '+', precedence: 0 },
                { value: 1 },
                { operator: '*', precedence: 1 },
                { operator: '*', precedence: 1 },
                { value: 2 },
                { operator: '+', precedence: 1 },
                { value: 3 },
                { operator: '-', precedence: 1 },
                { value: 4 },
                { value: 5 },
                { value: 6 },
            ])
            t.end()
        });
        t.test('├─ wrapping the entire expression in parentheses', t => {
            const tokens = lex('(((10 / 2.5)))');
            const root = parse(tokens);
            t.ok(root.value instanceof Token.Division);
            t.ok(root.left.value instanceof Token._Number, 'left should be a number');
            t.equal(root.left.value.value, 10);
            t.ok(root.right.value instanceof Token._Number, 'right should be a number');
            t.equal(root.right.value.value, 2.5);
            t.end();
        });
    });

    main.test('├ syntax errors', t => {
        t.test('├─ *')
        t.test('├─ * a')
        t.test('├─ a / *')
        t.test('├─ a +')
        t.test('├─ ( a - b ')
        t.test('├─ a - b )')
    });
});