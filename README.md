# algebra
A javascript algebra engine
```js
import { calculate } from 'algebra'
calculate('1+1') // => 2
calculate('5(10^2)(12-9)') // => 1500
```
# Motivation
The goal of this project is to parse and solve algebraic equations.
For instance, given `2x-5=10`, output `x=15/2`.

- Why not use `eval`?

  Similar beahviour could be achieved by simply using eval. But that would:
  - be too easy
  - be incredibly boring
  - prevent implementing more complex behaviours, such as implicit multiplication, exponentiation with the '^' sign, fraction reducing, algebraic variables, etc...

# Implementation
The code is written in a functional style. A previous imperative version of the code is available unser the `imperative` branch, though the algorithm is the same.

There are two core modules:

## Lexer
The lexer, defined in `src/core/lex/`, takes an input string and returns a list of tokens.
It identifies numbers, operands, and parentheses.
It also handles token transformation based on context. For instance, it differentiates negative numbers from substractions, and handles implicit multiplication (ie `2(2+10)` is interpreted as `2*(2+10)`).

## Parser
The parser, defined in `src/core/parse/`, takes a list of tokens and produces a syntax tree.
It analyses operation precedence, and handles parentheses.

## Higher level funcitons
Then, higher level functions, such as `calculate`, `reduce` or `solve` are defined on the parse tree. These are public facing functions that use the core internally.
