//private 섹션
let guest = -1;
let user = 1;
let admin = 10;
let superman = 999;

const DATABASE_INFO = {
    dev: {
        HOST: 'lineworldap.iptime.org',
        PORT: 33306,
        USER: 'root',
        PASSWORD: 'line9876',
        DATABASE: 'mysql'
    },
    pro: {
        HOST: 'lineworldap.iptime.org',
        PORT: 33306,
        USER: 'root',
        PASSWORD: 'line9876',
        DATABASE: 'mysql'
    }
};

const ssh_config = {
    host: 'lineworldap.iptime.org',
    port: 9022,
    username: 'line-dev',
    password: 'line9876'
}

// 요청 정상결과
const suc_result = {
    'code' : 200,
    'data' : null,
    'status_code': 'OK',
    'message' : '' 
}

// 요청 실패결과
const err_result = {
    'code' : 500,
    'data' : null,
    'status_code': 'FAIL',
    'message' : '' 
}

module.exports = {
    //exports 를 위한 설정
    guest: guest,
    user: user,
    admin: admin,
    superman: superman,
    DATABASE_INFO: DATABASE_INFO,
    ssh_config: ssh_config,
    suc_result: suc_result,
    err_result: err_result,

    //특정 권한이 필요한 경우에만 정책으로 등록
    policy: [
        // {pathway: '/notice/list', authority: guest},
        {pathway: '/', authority: guest}
    ], 

    admin_list: [
        {authority: admin, id: 'admin'}
    ],

    connection_MYSQL: {
        dev: {
            connectionLimit : 1000,
            connectTimeout  : 60 * 60 * 1000,
            // aquireTimeout   : 60 * 120 * 1000,
            // timeout         : 60 * 120 * 1000,
            host: DATABASE_INFO.dev.HOST,
            port: DATABASE_INFO.dev.PORT,
            user: DATABASE_INFO.dev.USER,
            database: DATABASE_INFO.dev.DATABASE,
            password: DATABASE_INFO.dev.PASSWORD,
            multipleStatements: true,
            debug: false
        },
        pro: {
            connectionLimit : 1000,
            connectTimeout  : 60 * 60 * 1000,
            // aquireTimeout   : 60 * 60 * 1000,
            // timeout         : 60 * 60 * 1000,
            host: DATABASE_INFO.pro.HOST,
            port: DATABASE_INFO.pro.PORT,
            user: DATABASE_INFO.pro.USER,
            database: DATABASE_INFO.pro.DATABASE,
            password: DATABASE_INFO.pro.PASSWORD,
            multipleStatements: true,
            debug: false
        }
    },

    // permitted_ip_list: [
    //     '*'
    // ]
};