let urlencode = require('urlencode');

module.exports = {
   uri : function (url, params) {
       let kr_regexp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
       let paramStr = '';
       for (let key in params) {
           if (kr_regexp.test(params[key])) {
               paramStr += key + '=' + urlencode(params[key]) + '&';
           }
           else {
               paramStr += key + '=' + params[key] + '&';
           }
       }
       paramStr = paramStr.substring(0, paramStr.length-1);
       return url.endsWith('?') === true ? url + paramStr : url + '?' + paramStr;
   }
};