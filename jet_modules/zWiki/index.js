let request = require('request');
let urlencode = require('urlencode');

module.exports = {
    get: function (query, callback) {
        let params = {
            action: 'query',
            prop: 'extracts',
            format: 'json',
            exintro: '',
            titles: query
        };

        let wiki_uri = 'https://en.wikipedia.org/w/api.php?';
        let kr_regexp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        for (let key in params) {
            if (kr_regexp.test(params[key])) {
                wiki_uri += key + '=' + urlencode(params[key]) + '&';
            }
            else {
                wiki_uri += key + '=' + params[key] + '&';
            }
        }
        wiki_uri = wiki_uri.substring(0, wiki_uri.length-1);

        console.log(wiki_uri);
        request({
            uri: wiki_uri,
            method: "get",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function (err, response, body) {
            if (err) return callback(err);
            callback(null, wiki_uri, body);
        });
    }

};