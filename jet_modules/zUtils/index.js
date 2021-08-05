module.exports = {
    getPrevPath: function (req) {

        function escapeRegExp(str) {
            return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        }

        // Replace utility function
        function replaceAll(str, find, replace) {
            return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }

        return replaceAll(req.get('referer'), req.get('origin'), '');
    },

    encode_utf8: function (s) {
        return unescape(encodeURIComponent(s));
    },
    decode_utf8: function (s) {
        return decodeURIComponent(escape(s));
    }
};

