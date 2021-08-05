let db = require('../jet_modules/zDb');
let config = require('../config');

module.exports = {
    testDB: async function(params, callback){
        let sql = `select host, user from user where user = ?`;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, params);

        callback(rslt);
    },
    
}

// 쿼리를 하나만 처리할 때 사용
async function testDB_model(){
    let param = ['root'];
    let sql = 'select host, user from user where user = ?';
    let rslt = await db.queryTransaction(sql, param);
    console.log(rslt);
    
}

// 쿼리의 결과값을 받으면서 코딩이 필요 할때 사용
async function testDB_models(){
    let params = ['root'];
    
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try{
        // 내용
        let sql = 'select host, user from user where user = ?';
        let sql_2 = 'select * from user where user = ?';

        let result = await connection.query(sql, params);
        console.log('result ==>', result[0][0]);

        let result_2 = await connection.query(sql_2, result[0][0].user_id);
        console.log('result_2 ==>', result_2[0]);

        await connection.commit();
        return result[0];
    }catch(e){
        await connection.rollback();
        console.error('Transaction rollbacked ======>',e);
        return e;
    }finally{
        connection.release();
    }
}

testDB_model();