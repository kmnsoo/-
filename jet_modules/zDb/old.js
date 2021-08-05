
let mysql = require('mysql');
let config = require('../../config');
let brp_pool = mysql.createPool(config.connection_BRP);


module.exports = {
    query: function (sql, params, callback) {
        brp_pool.getConnection(function (err, connection) {
            if (err) {
                if (connection) connection.release();
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('@Database connection was closed.')
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('@Database has too many connections.')
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('@Database connection was refused.')
                }
                return callback(err);
            }
            else {
                console.log('connected as id ' + connection.threadId);
                connection.query(sql, params, function (err, rs, fields) {
                    connection.release();
                    if (err) {
                        console.error('@message : ' + err.message);
                        console.error('@sql at : ' + sql);
                        return callback(err);
                    }
                    // Debug
                    // console.log('sql : ' + sql);
                    return callback(err, rs, fields);
                });
                connection.on('error', function (err) {
                    if (connection) connection.release();
                    return callback(err);
                });
            }
        });
    },
    handleDisconnect : function () {
        let self = this;
        let connection = mysql.createConnection(config.connection_BRP);

        connection.connect(function(err) {
            if(err) {
                console.log('@@@ error when connecting to db:', err);
                setTimeout(self.handleDisconnect(), 1000);
            }
        });

        connection.on('error', function(err) {
            console.log('@@@ DB error', err);
            if(err.code === 'PROTOCOL_CONNECTION_LOST') {
                self.handleDisconnect();
            } else {
                throw err;
            }
        });
    },
    connection : function () {
        return mysql.createPool(config.connection_BRP);
    },
    alias: mysql
};

