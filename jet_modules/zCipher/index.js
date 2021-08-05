let crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');

let algorithm = 'aes-256-cbc';
const salt = 'Thdbfdltkfkdgo!';

const ENCRYPTION_KEY = 'tkfkdgksmssoEkfthdbfdlrjsrkdgofk'; // Must be 256 bytes (32 characters)
const IV = 'dnflEkfdlQjwufk~';
const IV_LENGTH = 16; // For AES, this is always 16

async function chkBcryptPassAsyncFunc  (plainTextPassword, hashedPassword) {
    return new Promise(function(resolve, reject) {
        hashedPassword = hashedPassword.replace(/^\$2y(.+)$/i, '$2a$1');
        bcrypt.compare(plainTextPassword, hashedPassword, function(err, res) {
            if (res) {
                resolve(res);
            } else {
                resolve(res);
            }
        });
    });
}

module.exports = {
    chkBcryptPassAsyncFunc: chkBcryptPassAsyncFunc,

    shaPass: function (toBeEncrypt) {
        let hash = crypto.createHash('sha256').update(toBeEncrypt).digest('base64');
        return hash;
    },

    bcryptPass: function (toBeEncrypt) {
        return new Promise(function(resolve, reject) {
            bcrypt.genSalt(10, function(err, saltRounds) {
                if (err) {
                    console.log('bcrypt.genSalt() errer : ', err.message);
                } else {
                    bcrypt.hash(toBeEncrypt, saltRounds, null, function(err, hash) {
                        if (err) { 
                            console.log('bcrypt.hash() errer : ', err.message); 
                        } else { 
                            if (hash) {
                                resolve(hash);
                            } else {
                                reject(new Error("bcryptPass is failed"));
                            }
                        }
                    });
                }
            });
        });
    },

    chkBcryptPass: function (plainTextPassword, hashedPassword) {
        return new Promise(function(resolve, reject) {
            hashedPassword = hashedPassword.replace(/^\$2y(.+)$/i, '$2a$1');
            bcrypt.compare(plainTextPassword, hashedPassword, function(err, res) {
                if (res) {
                    resolve(res);
                } else {
                    reject(res);
                }
            });
        });
    },

    

    chkBcryptPassAsync : async function (plainTextPassword, hashedPassword) {
        try{
            return await chkBcryptPassAsyncFunc(plainTextPassword, hashedPassword);
        }catch(e){
            console.log('chkBcryptPassAsync error : ',e);
        }
    },

    // brpEnc: function (toBeEncrypt) {
    // let cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from('abcdef@#$23sef34', 'utf8'),
    //     Buffer.from('abcdef@#$23sef34', 'utf8'));
    //
    // let crypted = cipher.update('tmx@kribb.re.kr', 'utf8', 'base64');
    // crypted += cipher.final('base64');
    // return crypted;
    //
    // let decipher = crypto.createDecipheriv('aes-128-cbc', getBytes('abcdef@#$23sef34'), getBytes('abcdef@#$23sef34'));
    // let dec = decipher.update('nWJRUapT+GpFyH9hfPGNEETMl5M6mXn9zccR3Dspbuw=', 'base64', 'utf8');
    // dec += decipher.final('utf8');
    // return dec;
    // },
    EncPass: function (pass, id) {
        let e = 'base64';
        let dataBytes = doXOR(getBytes(pass), getBytes(id));
        let md5 = crypto.createHash('md5')
            .update(dataBytes).digest(e);
        return md5;
    },
    shexa: function (text) {
        let result = '';
        if (text) {
            let cipher = crypto.createCipher(algorithm, salt);
            let crypted = cipher.update(text, 'utf8', 'hex');
            crypted += cipher.final('hex');
            for (let i = 0; i < crypted.length; i++) {
                if (i % 2 == 0)
                    result += crypted[i];
            }
            return result;
        } else {
            return result;
        }
    },
    hexa: function (text) {
        if (text) {
            let cipher = crypto.createCipher(algorithm, salt);
            let crypted = cipher.update(text, 'utf8', 'hex');
            crypted += cipher.final('hex');
            return crypted;
        } else {
            return text;
        }
    },

    encrypt: function (text) {
        let iv = Buffer.from(IV);
        let key = Buffer.from(ENCRYPTION_KEY);
        let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('base64');
    },

    decrypt: function (text) {
        let iv = Buffer.from(IV);
        let encryptedText = Buffer.from(text, 'base64');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },

    // encrypt: function (text) {
    //     if (text) {
    //         let cipher = crypto.createCipher(algorithm, salt);
    //         let crypted = cipher.update(text, 'utf8', 'base64');
    //         crypted += cipher.final('base64');
    //         return crypted;
    //     }
    //     else {
    //         return text;
    //     }
    // },
    // decrypt: function (text) {
    //     if (text) {
    //         let decipher = crypto.createDecipher(algorithm, salt);
    //         let dec = decipher.update(text, 'base64', 'utf8');
    //         dec += decipher.final('utf8');
    //         return dec;
    //     }
    //     else {
    //         return text;
    //     }
    // }
};


function getBytes(str) {
    // let buf = new Buffer(str.length);
    let buf = Buffer.alloc(str.length);
    for (let i = 0; i < str.length; i++) {
        buf[i] = str.charCodeAt(i);
    }
    return buf;
}

function doXOR(byte1, byte2) {
    let byteLen = Math.max(byte1.length, byte2.length);
    // let buf = new Buffer(byteLen);
    let buf = Buffer.alloc(byteLen);
    for (let i = 0; i < byteLen; i++) {
        buf[i] = byte1[i % byte1.length] ^ byte2[i % byte2.length];
    }
    return buf;
}
