let express = require('express');
let indexController = require('../controllers/indexController');


module.exports = function () {

    let router = express.Router();

    router.get('/', indexController.main);
    router.post('/testDB', indexController.testDB);
    return router;
};


