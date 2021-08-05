let cipher = require('../zCipher');
let config = require('../../config');

let sessionKeys = [
    { key: 'userSn', getMethod: 'getPlain'},
    { key: 'userName', getMethod: 'getPlain'},
    { key: 'userId', getMethod: 'getPlain'},
    { key: 'userZip', getMethod: 'getPlain'},
    { key: 'userAddr1', getMethod: 'getDec'},
    { key: 'userAddr2', getMethod: 'getDec'},
    { key: 'userTel', getMethod: 'getDec'},
    { key: 'userHTel', getMethod: 'getDec'},
    { key: 'userEmail', getMethod: 'getDec'},
    { key: 'authority', getMethod: 'getPlain'}
];

module.exports = {

    //암호화 데이터를 세션에 저장
    setEnc: function (req, key, value) {
        req.session[key] = cipher.encrypt(value);
    },
    //암호화 데이터를 세션에서 플레인텍스트로 변경해서 가져옴
    getDec: function (req, key) {
        try {
            if (req.session[key]) {
                return cipher.decrypt(req.session[key]);
            }
            //세션 연결이 끊어진 것으로 판단
            else {
                return false;
            }
        } catch (e) {
            return false;
        }
    },
    //플레인 데이터를 설정함
    setPlain: function (req, key, value) {
        req.session[key] = value;
    },
    //플레인 데이터를 가져옴
    getPlain: function (req, key) {
        return req.session[key];
    },
    // 사용자 데이터를 가져옴
    getUserInfo: function (req) {
        if (req.session.authority === config.guest) return;
        return {
            userSn : this.getPlain(req, 'userSn'),
            userName : this.getPlain(req, 'userName'),
            userId : this.getPlain(req, 'userId'),
            userZip : this.getPlain(req, 'userZip'),
            userAddr1 : this.getDec(req, 'userAddr1'),
            userAddr2 : this.getDec(req, 'userAddr2'),
            userTel : this.getDec(req, 'userTel'),
            userHTel : this.getDec(req, 'userHTel'),
            userEmail : this.getDec(req, 'userEmail')
        };
    },
    Clear: function (req, res) {
        req.session.destroy();
        res.clearCookie('S_DATA');
    },
    editable: function (req, userid) {
        // 관리자 인지를 확인해서 관리자 일 경우 항상 TRUE 가 나오도록 한다.
        if (req.session.authority === config.guest) return false;
        if (req.session.authority === config.admin) {
            return true;
        }
        else {
            return (this.getDec(req, 'uid') === userid);
        }

    }
};


