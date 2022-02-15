console.log(Object.is(2, 2)); // true
console.log(Object.is({}, {})); // false
let banana = {};
let cherry = banana;
let chocolate = cherry;
cherry = {};
console.log(Object.is(banana, cherry));
console.log(Object.is(cherry, chocolate));
console.log(Object.is(chocolate, banana));