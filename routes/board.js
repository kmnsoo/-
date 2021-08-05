let express = require('express');
let boardController = require('../controllers/boardController');

module.exports = function () {

    let router = express.Router();

    router.get('/view', boardController.boardView);

    return router;
};


