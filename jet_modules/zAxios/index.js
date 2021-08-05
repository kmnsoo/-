const axios = require('axios');

const host = 'http://localhost:1111';


function getRequestCallback(url, callback, params){
    // console.log('url~~~>',host+url);
    axios.get(host+url, {
        params: {params}
    })
    .then(function (response) {
        // console.log(response);
        if( typeof callback!='undefined' && callback!=null ) callback(response);
    })
    .catch(function (error) {
        // console.log(error);
    })
    .finally(function () {
        // always executed
    });
}

function postRequestCallback(url, data, callback){
    console.log('~~~~~~~~~~~~~~~~~~~~postRequestCallback called data===>',data);
    axios.post(host+url, { data })
    .then(function (response) {
        // console.log(response);
        if( typeof callback!='undefined' && callback!=null ) callback(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}

module.exports = {
    getRequestCallback: getRequestCallback,
    postRequestCallback: postRequestCallback,
};
