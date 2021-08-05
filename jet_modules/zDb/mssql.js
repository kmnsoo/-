let mssql = require('mssql');
let config = require('../../config');
const cnn_pool = new mssql.ConnectionPool(config.connection_MSSQL);
const kctc_pool = cnn_pool.connect()
    .then(result => {
        // console.dir(result)
        return result;
    }).catch(err => {
        // ... error checks
        console.log( `@Database Connection Error. [${err.message}]` );
    });

/**
 * basic query
 * @param sql
 * @param callback
 */
function query(sql, callback) {
    queryPromise(sql)
    .then(result => {
        callback(result);
    }).catch(err => {
        // ... error checks
        console.error(`@Database SQL error. err-[${err}], sql-[${sql}]`);
    });
}

function queryPromise(sql) {
    return new Promise(function (resolve, reject){
        setImmediate(function(){
            kctc_pool.then((pool) => {
                if( typeof(pool) == "undefined" ) {
                    reject( new Error('@Database Connection Pool is NULL.') );
                }
                // return pool.request().query(sql);
                console.log(`sql=>${sql}`);
                return pool.query(sql);
                // return pool.query('SELECT SYSDATETIME();');
            }).then(result => {
                // console.dir(result);
                resolve(result);
                // return result;
            }).catch(err => {
                console.error(`@Database SQL error. err-[${err}], sql-[${sql}]`);
                reject( err );
            });
        });
    });
}

function handleDisconnect() {
    // let connection = mssql.createConnection(config.connection_BRP);

    // connection.connect(function (err) {
    //     if (err) {
    //         console.log('@@@ error when connecting to db:', err);
    //         setTimeout(handleDisconnect, 1000);
    //     }
    // });

    // connection.on('error', function (err) {
    //     console.log('@@@ DB error', err);
    //     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    //         handleDisconnect();
    //     } else {
    //         throw err;
    //     }
    // });
}

function connection() {
    // return kctc_pool;
    return kctc_pool;

    // await kctc_pool;
    // return kctc_pool;
}

function connectionClose() {
    // Close all active connections in the pool.
    kctc_pool.close();
}

// handleDisconnect();

module.exports = {
    query: query,
    queryPromise: queryPromise,
    connection: connection
};


