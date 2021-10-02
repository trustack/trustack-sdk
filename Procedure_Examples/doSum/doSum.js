/*
    'input' is a global object passed into your code, received via the parameters the calling origin passes into the Procedure
    header. See Trustack docs for more information.

    In this example, this Procedure will simply sum the two provided values.
*/
let val1 = input.val1;
let val2  = input.val2;

/*
    All Procedures must export a single function with no parameters, and return a Promise.
*/
module.exports = function () {
    return new Promise((resolve, reject) => {
        resolve(val1+val2);
    });
}