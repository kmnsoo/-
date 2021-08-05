let urlencode = require('urlencode');

module.exports = {
   toRestUri : function (url, params) {
       let kr_regexp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
       let paramStr = '';
       for (let key in params) {
           let value = urlencode(String(params[key]).replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ''));
           paramStr += key + '=' + value + '&';
       }
       paramStr = paramStr.substring(0, paramStr.length-1);
       return url.endsWith('?') === true ? url + paramStr : url + '?' + paramStr;
   }
};