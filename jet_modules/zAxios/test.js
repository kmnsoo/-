let zAxios = require('../zAxios');

/**
 * 테스트 방법
 * cd [project-root]
 * node ./jet_modules/zAxios/test.js
 */

 

function main(){
    // let current_date = new Date();
    // current_date.setSeconds( current_date.getSeconds() + 10);
    // zSchedule.setScheduleCallback( current_date, jobData );
    const callback = (response) => {
        console.log(`respone get~~~~~~~~~~~~~~~${new Date()}`);
        console.dir(response.data);
    };
    zAxios.getRequestCallback('/schedule/using/seat/get', callback);
}
main();
