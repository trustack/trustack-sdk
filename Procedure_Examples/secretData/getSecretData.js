const httpsec = require('https');

/*
    'input' is a global object passed into your code, received via the parameters the calling origin passes into the Procedure
    header. See Trustack docs for more information.

    In this example, this Procedure will attempt to retrieve protected content at the given address (secretFileAddress), 
    using the provided token (authToken) as authorization
*/
let secretFileAddress = input.secretFileAddress;
let authToken  = input.authToken;


function checkUserValid(userToken) {
    return new Promise((resolve, reject) => {
        let isAuthed = false;
        /*
            In production, validate the user via your authentication workflow.
            In future version, Trustack can provide authentication for your users via decentralized DID standard.
            In this example - we just return true for demonstration purposes.
        */
        resolve(true);
    });
}

function checkUserAllowed(address, userCipher) {
    return new Promise((resolve, reject) => {
       let isAllowed = false;
       /*
        In production, check your access control workflow to see if this user has access to the requested resource.
        In this example - we just return true for demonstration purposes.
       */
       resolve(true);
    });
}

function getContent(url) {
    return new Promise((resolve, reject) => {
        let request = httpsec.get(url, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (body) {
                resolve(body);
            });
            res.on('error', function (err) {
                reject(err);
            })
        });
    });
}


/*
    All Procedures must export a single function with no parameters, and return a Promise.
*/
module.exports = function () {
    return new Promise((resolve, reject) => {
        checkUserValid(authToken).then((isValid) => {
            if (isValid) {
                checkUserAllowed(secretFileAddress, authToken).then((isAllow) => {
                    if (isAllow) {
                        getContent(`https://cloudflare-ipfs.com/ipfs/${secretFileAddress}`).then((secretData) => {
                            resolve(secretData);
                        }).catch((err) => {
                            resolve(err);
                        });
                    }
                }).catch((err) => {
                    resolve(err);
                });
            }
        }).catch((err) => {
            resolve(err);
        });
    });
}