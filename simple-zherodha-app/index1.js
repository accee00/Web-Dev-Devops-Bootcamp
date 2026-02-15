// function someCallback() {
//     let n = 0;
//     for (let i = 0; i < 100000000; i++) {
//         n += i;
//     }
//     console.log(n);
// }

// /// Tu ja somewhere else mai CPU ko tb tk baaki kaam mai lagata hunn..
// setTimeout(someCallback, 1000);

// console.log("harsh");

// let c = 0;

// function someCallBackfn() {
//     c = c + 1;
//     console.log(c);
// }

// /// call this function probabaly like in every one second.
// setInterval(someCallBackfn, 0)

// /// the control goes here  CPU busy doing heavy operations
// /// setInterval 1 sec ho gya but 
// /// CPU ideal nhi hai.. toh Callback call hi nhi hoga..
// let z = 0;
// for (let i = 0; i < 1000000000; i++) {
//     z = z + i;
// }
// console.log(z)



// function sum(a, b) {

// }

// const sum = (a, b) => {

// }


const arr = [1, 2, 3, 4]

const result = arr.map((e) => e * 2);

console.log(result)