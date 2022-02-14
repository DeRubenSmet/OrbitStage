const value = new Date();

if(typeof(value) === 'date'){
console.log("klopt");
}
else console.log("fout");
console.log(typeof(value));

console.log(typeof(undefined));
console.log(typeof(null));
console.log(typeof(true));
console.log(typeof(false));
console.log(typeof(-100));
console.log(typeof(112132465613168446565165468n));
console.log(typeof("hello"));
console.log(typeof({}));
console.log(typeof(x => x * 2));
console.log(typeof(typeof(value)));
