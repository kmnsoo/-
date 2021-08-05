var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
moment.locale('ko');

module.exports = {
    date: function(){
        return moment();
    },
    newFmtDate: function(){
        return moment().format('YYYY-MM-DD:HH-mm-ss');
    },
    getFmtDate: function(date){
        return moment(date).format('YYYY-MM-DD:HH-mm-ss');
    },
    getKorTime: function(){
        return moment().format('LT');
    },
    getKorFullDate: function(){
        return moment().format('LLL');
    },
};