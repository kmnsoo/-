let request = require('request');
let urlencode = require('urlencode');

function ndsl(data) {
    let edited = [
        {COUNT : data.resultSummary.totalCount},
        {HITS : data.outputData}
    ];
    // let edited = data.resultSummary;
    return edited;
}

module.exports = {
    get: function (params, callback) {

        params.keyValue = '05654492';
        params.returnType = 'json';
        params.callback = 'ndsl';

        let ndsl_uri = 'http://openapi.ndsl.kr/itemsearch.do?';
        let kr_regexp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        for (let key in params) {
            if (kr_regexp.test(params[key])) {
                ndsl_uri += '&' + key + '=' + urlencode(params[key]);
            }
            else {
                ndsl_uri += '&' + key + '=' + params[key];
            }
        }
        request({
            uri: ndsl_uri,
            method: "get",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function (err, response, body) {
            if (err) return callback(err);
            callback(null, ndsl_uri, eval(body));
        });
    }

};