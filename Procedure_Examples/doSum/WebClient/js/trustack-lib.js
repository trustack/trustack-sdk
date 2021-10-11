export { TrustackHelper, ab2str, decode_base64, encryptText }

/**
 * Helper class to simplify interaction with Trustack Exec nodes. runProcAsync is the primary method for use in the class.
 */
class TrustackHelper {
    /**
     * Constructure
     * @param {*} trustackBootStrapURL URL of the bootstrap Trustack node, aka, Proxy node. TODO: Set a default value once a reliable node is up.
     * @param {*} isServerLocal 
     */
    constructor(trustackBootStrapURL, isServerLocal = false) {
        this.isServerLocal = isServerLocal;
        this.trustackUrl = trustackBootStrapURL;
        this.trustackPath = "/procedures/";
    }

    /**
     * This will format the request ot execute a Procedure, and return the results of the Procedure in JSON format (by default)
     * @param {string} procId Unique ID of the Procedure
     * @param {*} inputs Input data expected by the Procedure
     * @param {function} postCb Callback function to handle the response from the Procedure
     * @param {bool} retRawData Default = false; runProcAsync will assume the return data is in JSON, setting this to true will return the data without parsing as JSON
     */
    runProcAsync(procId, inputs, postCb, retRawData = false) {
        let procAddress = this.trustackUrl + this.trustackPath + procId;

        let data = {};
        data.procId = procId;

        let userObjStr = encodeURIComponent(JSON.stringify(inputs));
        data.procInputs = userObjStr;

        let start = new Date().getTime();
        let dataStr = JSON.stringify(data);
        dataStr = btoa(dataStr);

        //*** VANILLA JS */
        //  fetch(procAddress, {
        //     method: 'post',
        //     body: dataStr
        // })
        //     .then(response => {
        //         if (response != "") {
        //             let respObj = JSON.parse(response);
        //             let outputObj = respObj.output;
        //             if (!retRawData) {
        //                 let outputStr = decode_base64(outputObj);
        //                 // TODO: We've seen some odd encoding bugs getting data back from the Trustack Exec Nodes, so this is meant to clean that up,
        //                 // assuming this is meant to be JSON data.
        //                 outputStr = outputStr.replace('ÿ', '');
        //                 outputStr = outputStr.replace('¿', '');
        //                 outputObj = JSON.parse(outputStr);
        //             }
        //             postCb(start, outputObj);
        //         }
        //     })
        //     .catch(err => {
        //         console.error(err);
        //     });

        //** USING JQUERY */
        $.ajax({
            url: procAddress,
            data: dataStr,
            type: 'post',
            success: function (response) {
                if (response != "") {
                    let respObj = JSON.parse(response);
                    let outputObj = respObj.output;
                    if (!retRawData) {
                        let outputStr = decode_base64(outputObj);
                        // TODO: We've seen some odd encoding bugs getting data back from the Trustack Exec Nodes, so this is meant to clean that up,
                        // assuming this is meant to be JSON data.
                        outputStr = outputStr.replace('ÿ', '');
                        outputStr = outputStr.replace('¿', '');
                        outputObj = JSON.parse(outputStr);
                    }
                    postCb(start, outputObj);
                }
            }
        });
    }

}



/////////////////////////////////////////////////////////////////
/// UTILS FUNCTIONS
/////////////////////////////////////////////////////////////////

async function encryptText(plainText, password) {
    const ptUtf8 = new TextEncoder().encode(plainText);

    const pwUtf8 = new TextEncoder().encode(password);
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);

    const iv = new Uint8Array(12); //TODO: Not ideal - fix later
    const alg = { name: 'AES-GCM', iv: iv };
    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']);

    return { iv, encBuffer: await crypto.subtle.encrypt(alg, key, ptUtf8) };
}
function ab2str(buf) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
}

// Can't fidn the original source of this - probably somewhere from stackoverflow
function decode_base64(s) {
    let b = 0, l = 0, r = '',
        m = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    [].forEach.call(s, function (v) {
        b = (b << 6) + m.indexOf(v); l += 6;
        if (l >= 8) r += String.fromCharCode((b >>> (l -= 8)) & 0xff);
    });
    return r;
}

function isApiUp(apiUrl, success, failure, method = 'GET') {
    let request = new XMLHttpRequest();
    request.open(method, apiUrl, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 404) {
                failure();
            }
            else {
                success();
            }
        }
    };
}