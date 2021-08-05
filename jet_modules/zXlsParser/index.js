let xlsx = require('xlsx');
let appRoot = require('app-root-path');
let path = require('path');
let date = require('../zDate');
let xconf = require('./conf');


module.exports = {
    convertToJSON: function (filePath, fileIndex, headerRowCount, callback) {
        try {
            let workbook = xlsx.readFile(path.join(appRoot + filePath));

            let sheet_name_list = workbook.SheetNames;
            sheet_name_list.forEach(function (sheet, sheetIndex) {
                try {
                    if ((!xconf.canReadMultiSheet()) && sheetIndex > 0)
                        return;

                    let worksheet = workbook.Sheets[sheet];
                    let headers = {};
                    let data = [];

                    for (let col_row_key in worksheet) {

                        if (col_row_key[0] === '!') continue;
                        //parse out the column, row, and value
                        let col_name_length = 0;
                        for (let i = 0; i < col_row_key.length; i++) {
                            if (!isNaN(col_row_key[i])) {
                                col_name_length = i;
                                break;
                            }
                        }

                        let col = col_row_key.substring(0, col_name_length);
                        let row = parseInt(col_row_key.substring(col_name_length));
                        let value = worksheet[col_row_key].v;

                        //store header names
                        if (row <= headerRowCount && value) {
                            headers[col] = value;
                            continue;
                        }

                        if (!data[row]) data[row] = {};
                        data[row][headers[col]] = value;
                    }

                    data.shift();
                    data.shift();

                    for (let r = 0; r < headerRowCount - 1; r++) {
                        data.shift();
                    }

                    callback(null, headers, data);
                } catch (e) {
                    callback(e);
                }
            });
        } catch (e) {
            callback(e);
        }
    },
    importToDB: function (req, filePath, fileIndex, dbObj, callback) {
        let workbook = xlsx.readFile(path.join(appRoot + filePath));
        let sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function (sheet, sheetIndex) {
            if ((!xconf.canReadMultiSheet()) && sheetIndex > 0)
                return;
            let worksheet = workbook.Sheets[sheet];
            let headers = {};
            let data = [];
            for (let z in worksheet) {
                if (z[0] === '!') continue;
                //parse out the column, row, and value
                let tt = 0;
                for (let i = 0; i < z.length; i++) {
                    if (!isNaN(z[i])) {
                        tt = i;
                        break;
                    }
                }
                let col = z.substring(0, tt);
                let row = parseInt(z.substring(tt));
                let value = worksheet[z].v;
                //store header names
                if (row == 1 && value) {
                    headers[col] = value;
                    continue;
                }
                if (!data[row]) data[row] = {};
                data[row][headers[col]] = value;
            }
            data.shift();
            data.shift();

            // 헤더 정보를 가지고 테이블을 만든다.
            if (Object.keys(headers).length != 0) {
                if (data.length != 0) {
                    let tableName = 'xls_' + date(new Date(), 'yyyyMMdd_' + fileIndex + sheetIndex + 'HHmmss');
                    createTable(dbObj, tableName, headers, function (err) {
                        if (err) return callback(err);
                        loadData(dbObj, tableName, headers, data, function (err, hCount, rCount) {
                            if (err) return callback(err);
                            callback(null, {tableName: tableName, hCount: hCount, rCount: rCount});
                        });
                    });
                }
            }
        });
    }
};

function createTable(dbObj, tableName, headers, callback) {
    let sql = "create table `" + tableName + "` (";
    Object.keys(headers).forEach(function (key) {
        sql += "`" + headers[key] + "` varchar(100) null,";
    });
    sql = sql.substr(0, sql.length - 1) + ");";
    dbObj.query(sql, [], function (err) {
        callback(err);
    });
}

function loadData(dbObj, tableName, headers, data, callback) {
    let sql = "insert into `" + tableName + "` (";
    Object.keys(headers).forEach(function (key) {
        sql += "`" + headers[key] + "`,"
    });
    sql = sql.substr(0, sql.length - 1) + ") values ?";
    let adata = [];
    let arow = [];
    data.forEach(function (row) {
        Object.keys(headers).forEach(function (key) {
            // console.log(headers[key]);
            arow.push(row[headers[key]] || null);
        });
        adata.push(arow);
        arow = [];
    });
    // console.log(adata);
    dbObj.query(sql, [adata], function (err, rs) {
        callback(err, Object.keys(headers).length, rs.affectedRows);
    });
}
