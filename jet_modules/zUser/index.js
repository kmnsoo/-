let sess = require('../zSession');
let config = require('../../config');
let db = require('../zDb');
let cipher = require('../zCipher');

module.exports = {
    editable: function (req, targetUserId) {
        // 관리자 인지를 확인해서 관리자 일 경우 항상 TRUE 가 나오도록 한다.
        return sess.getDec(req, uid) === targetUserId;
    }

};