
var assert = require('assert')
var parse = require('../').parse

function addTest(arg) {
	//console.log('testing: ', arg)
	try {
		var x = parse(arg)
	} catch(err) {
		x = 'fail'
	}
	try {
		var z = eval('(function(){"use strict"\nreturn ('+String(arg)+'\n)\n})()')
	} catch(err) {
		z = 'fail'
	}
	assert.deepEqual(x, z)
}

addTest('"\\uaaaa\\u0000\\uFFFF\\uFaAb"')
addTest(' "\\xaa\\x00\xFF\xFa\0\0"  ')
addTest('"\\\'\\"\\b\\f\\t\\n\\r\\v"')
addTest('"\\q\\w\\e\\r\\t\\y\\\\i\\o\\p\\[\\/\\\\"')
addTest('"\\\n\\\r\n\\\n"')
addTest('\'\\\n\\\r\n\\\n\'')
addTest('  null')
addTest('true  ')
addTest('false')
addTest(' Infinity ')
addTest('+Infinity')
addTest('[]')
addTest('[ 0xA2, 0X024324AaBf]')
addTest('-0x12')
addTest('  [1,2,3,4,5]')
addTest('[1,2,3,4,5,]  ')
addTest('[1e-13]')
addTest('[null, true, false]')
addTest('  [1,2,"3,4,",5,]')
addTest('[ 1,\n2,"3,4,"  \r\n,\n5,]')
addTest('[  1  ,  2  ,  3  ,  4  ,  5  ,  ]')
addTest('{}  ')
addTest('{"2":1,"3":null,}')
addTest('{ "2 " : 1 , "3":null  , }')
addTest('{ \"2\"  : 25e245 ,  \"3\": 23 }')
addTest('{"2":1,"3":nul,}')
addTest('{:1,"3":nul,}')
addTest('[1,2] // ssssssssss 3,4,5,]  ')
addTest('[1,2 , // ssssssssss \n//xxx\n3,4,5,]  ')
addTest('[1,2 /* ssssssssss 3,4,*/ /* */ , 5 ]  ')
addTest('[1,2 /* ssssssssss 3,4,*/ /* * , 5 ]  ')
addTest('{"3":1,"3":,}')
addTest('{ чйуач:1, щцкшчлм  : 4,}')
addTest('{ qef-:1 }')
addTest('{ $$$:1 , ___: 3}')
addTest('{3:1,2:1}')

if (process.version > 'v0.11.7') {
	assert(Array.isArray(parse('{__proto__:[]}').__proto__))
	assert.equal(parse('{__proto__:{xxx:5}}').xxx, undefined)
	assert.equal(parse('{__proto__:{xxx:5}}').__proto__.xxx, 5)

	var o1 = parse('{"__proto__":[]}')
	assert.deepEqual([], o1.__proto__)
	assert.deepEqual(["__proto__"], Object.keys(o1))
	assert.deepEqual([], Object.getOwnPropertyDescriptor(o1, "__proto__").value)
	assert.deepEqual(["__proto__"], Object.getOwnPropertyNames(o1))
	assert(o1.hasOwnProperty("__proto__"))
	assert(Object.prototype.isPrototypeOf(o1))

	// Parse a non-object value as __proto__.
	var o2 = JSON.parse('{"__proto__":5}')
	assert.deepEqual(5, o2.__proto__)
	assert.deepEqual(["__proto__"], Object.keys(o2))
	assert.deepEqual(5, Object.getOwnPropertyDescriptor(o2, "__proto__").value)
	assert.deepEqual(["__proto__"], Object.getOwnPropertyNames(o2))
	assert(o2.hasOwnProperty("__proto__"))
	assert(Object.prototype.isPrototypeOf(o2))
}

assert.throws(parse.bind(null, "{-1:42}"))

for (var i=0; i<100; i++) {
	var str = '-01.e'.split('')

	var rnd = [1,2,3,4,5].map(function(x) {
		x = ~~(Math.random()*str.length)
		return str[x]
	}).join('')	

	try {
		var x = parse(rnd)
	} catch(err) {
		x = 'fail'
	}
	try {
		var y = JSON.parse(rnd)
	} catch(err) {
		y = 'fail'
	}
	try {
		var z = eval(rnd)
	} catch(err) {
		z = 'fail'
	}
	//console.log(rnd, x, y, z)
	if (x !== y && x !== z) throw 'ERROR'
}

var array = [""]
var expected = "''"
for (var i = 0; i < 1000; i++) {
  array.push("")
  expected = "''," + expected
}
expected = '[' + expected + ']'
assert.equal(expected, stringify(array))