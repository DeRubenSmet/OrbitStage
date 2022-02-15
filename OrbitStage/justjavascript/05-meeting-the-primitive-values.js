console.log(typeof(undefined));
let person = undefined;
//console.log(person.mood);
let bandersnatch;
console.log(bandersnatch);
//console.log(jabberwocky);
let jabberwocky;
let mimsy = null;
//console.log(mimsy.mood);
console.log(typeof(null));
console.log(typeof(true));
console.log(typeof(false));
let isSad = true;
let isHappy = !isSad; 
let isFeeling = isSad || isHappy; 
let isConfusing = isSad && isHappy;
console.log(typeof(28)); // "number"
console.log(typeof(3.14)); // "number"
console.log(typeof(-140));
console.log(0.1 + 0.2 === 0.3);
console.log(0.1 + 0.2 === 0.30000000000000004);
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.MAX_SAFE_INTEGER + 1);
console.log(Number.MAX_SAFE_INTEGER + 2);
console.log(Number.MAX_SAFE_INTEGER + 3);
console.log(Number.MAX_SAFE_INTEGER + 4);
console.log(Number.MAX_SAFE_INTEGER + 5);
let scale = 0;
let a = 1 / scale; // Infinity
let b = 0 / scale; // NaN
let c = -a; // -Infinity
let d = 1 / c; // -0
console.log(typeof(NaN)); // "number"
let alot = 9007199254740991n; // n at the end makes it a BigInt!
console.log(alot + 1n); // 9007199254740992n
console.log(alot + 2n); // 9007199254740993n
console.log(alot + 3n); // 9007199254740994n
console.log(alot + 4n); // 9007199254740995n
console.log(alot + 5n); // 9007199254740996n
console.log(typeof("こんにちは")); // "string"
console.log(typeof('こんにちは')); // "string"
console.log(typeof(`こんにちは`)); // "string"
console.log(typeof('')); // "string"
let cat = 'Cheshire';
console.log(cat.length); // 8
console.log(cat[0]); // "C"
console.log(cat[1]); // "h"
let alohomora = Symbol();
console.log(typeof(alohomora)); 
let shampoo;
let soap = null;
soap = shampoo;
console.log(soap);