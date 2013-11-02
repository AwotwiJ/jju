
var assert = require('assert')
var parse = require('../').parse
var stringify = require('../').stringify

function deepEqual(x, y) {
	if (Number.isNaN(x)) {
		return assert(Number.isNaN(y))
	}
	assert.deepEqual(x, y)
}

function addTest(arg, arg2) {
	deepEqual(parse(stringify(arg)), arg2 === undefined ? arg : arg2)
}

addTest(0)
addTest(-0)
addTest(NaN)
addTest(Infinity)
addTest(-Infinity)
addTest(123)
addTest(19508130958019385.135135)
addTest(-2e123)
addTest(null)
addTest(undefined)
addTest([])
addTest([,,,,,,,], [null,null,null,null,null,null,null])
addTest([undefined,null,1,2,3,], [null,null,1,2,3])
addTest([[[[]]],[[]]])
addTest({})
addTest({1:2,3:4})
addTest({1:{1:{1:{1:4}}}, 3:4})
addTest({1:undefined, 3:undefined}, {})
addTest(new Number(4), 4)
addTest(new Boolean(true), true)
addTest(new String('xqefxef'), 'xqefxef')
addTest(new Boolean(), false)

var r='';for (var i=0; i<5000; i++) {r+=String.fromCharCode(i)}
addTest(r)

assert.equal("[1, 2, 3]", stringify([1, 2, 3], {indent: 1}))
assert.equal("[1, 2, 3]", stringify([1, 2, 3], {indent: 2}))

var oddball = Object(42)
oddball.__proto__ = { __proto__: null }
assert.equal('{}', stringify(oddball))

/* this WILL throw
var falseNum = Object("37")
falseNum.__proto__ = Number.prototype
assert.equal("{0: '3', 1: '7'}", stringify(falseNum))*/
