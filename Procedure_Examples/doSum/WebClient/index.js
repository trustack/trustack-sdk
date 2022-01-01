// import {ab2str} from "/js/trustack-lib.js";

//  const { default: TrustackHelper } = require("../../../src/trustack-lib.js");

// import {decode_base64} from "/js/trustack-lib.js";

let start;
import("./js/trustack-lib.js").then((TrustackSDK) => {
    let IS_LOCAL = true;
    let trustackBootStrapURL;

    if (IS_LOCAL) {
        trustackBootStrapURL = "https://localhost:8081";
    }
    else {
        trustackBootStrapURL = "https://trstgw1.westus.cloudapp.azure.com:8081";
    }

    const trustackHelper = new TrustackSDK.TrustackHelper(trustackBootStrapURL, true);
    const getSumProcedureAddress = "QmPJWE8CKGyyRYf8hjJ4orG1SkgonVJF1XezazfN4YfLA6";


    const button = document.querySelector("#sumNumbersBtn");
    button.addEventListener('click', function (event) {
        let val1 = document.querySelector("#val1Txt").value;
        let val2 = document.querySelector("#val2Txt").value;
        doSum(val1, val2, renderSum);
    });

    function renderSum(runTime, sum) {
        let end = window.performance.now();
        console.log(`Procedure execution time: ${end - start} ms`);
        $("#sumFieldTxt").text(sum + "  (° ͜ʖ°)");
    }

    /**
     * @description Add two numbers together and return the sum.
     * @param {int} val1 Value to be summed.
     * @param {int} val2 Value to be summed.
     * @param {function} renderSumCb Sum is returned via this callback, and expected to be rendered by the front-end.
     */
    function doSum(val1, val2, renderSumCb) {
        let inputs = {};
        inputs.val1 = val1;
        inputs.val2 = val2;

        start = window.performance.now();
        trustackHelper.runProcAsync(getSumProcedureAddress, inputs, renderSum);
    }
})