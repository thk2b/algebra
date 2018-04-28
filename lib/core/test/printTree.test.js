'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('core/printTree', function (main) {
    main.test('├ basic tree', function (t) {
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('1'))), '1');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('1+1'))), '1+1');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('1 + 1'))), '1+1');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('1-1'))), '1-1');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('2*1'))), '2*1');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('20/1'))), '20/1');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('20^1'))), '20^1');
        t.end();
    });
    main.test('├ tree', function (t) {
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('(2)(2)'))), '2*2');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('(2+3)(5-4)'))), '(2+3)*(5-4)');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('(2+3)/(5-4)'))), '(2+3)/(5-4)');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('(2*3)^(5/4)'))), '(2*3)^(5/4)');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('((1--2)(2+3))(5-4)'))), '(1--2)*(2+3)*(5-4)');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('(1+4)/(6^10-4)(8/9(2+3))'))), '(1+4)/(6^10-4)*(8/9*(2+3))');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('(1+1)/(2+2)(3+3)'))), '(1+1)/(2+2)*(3+3)');
        t.end();
    });
    main.test('├ custom separator', function (t) {
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('20/1')), ' '), '20 / 1');
        t.equal((0, _.printTree)((0, _.parse)((0, _.lex)('(2+3)/(5-4)')), '_'), '(_2_+_3_)_/_(_5_-_4_)');
        t.end();
    });
});