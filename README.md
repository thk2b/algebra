[Live demo](https://thk2b.github.io/algebra-site/)

[Demo repository](https://github.com/thk2b/algebra-site)

```
npm install --save @thk2b/algebra
```

# algebra
A javascript algebra engine

```js
import { calculate, simplify } from 'algebra'
calculate('1+1') // => 2
calculate('2*2') // => 4
calculate('2(2+2)') // => 8, with implicit multiplication
calculate('5(10^2)(12-9)') // => 1500
calculate('10:sqrt(25)') // => 50

simplify('16/24') // => '2/3'
```
## Binary operators

Suported binary operators are `+, -, *, /`.

## Unary operators

Unary operators must be preceded by the `:` character.
Suported unary operators are `:sqrt, :sin, :cos, :tan`.

# Motivation
The ultimate goal of this project is to parse and simplify algebraic expressions.

The output should be correct with regards to the rules of algebra. For instance, the order of operations must be respected. 

Errors in invalid input strings should be identified and clearly communicated to the user.

- Why not use `eval`?

  Similar beahviour could be achieved by simply using `eval`. But that would prevent implementing more complex behaviours, such as implicit multiplication,fraction reducing, algebraic variables, as well as custom operators such as exponentiation with the '^' sign.

# Implementation
The code is written in a functional style. A previous imperative version of the code is available unser the `imperative` branch, though the algorithm is the same.

There are two core modules:

## Lexer
The lexer, defined in `src/core/lex/`, takes an input string and returns a list of tokens.
It identifies numbers, operands, and parentheses.
It also handles token transformation based on context. For instance, it differentiates negative numbers from substractions, and handles implicit multiplication (ie `2(2+10)` is interpreted as `2*(2+10)`).

## Parser
The parser, defined in `src/core/parse/`, takes a list of tokens and produces a syntax tree.
It handles operation precedence, and parentheses.

## Higher level funcitons
Then, higher level functions, such as `calculate`, `reduce` or `solve` are defined on the parse tree. These are public facing functions that use the core internally.
