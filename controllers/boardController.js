let config = require('../config');
let boardModel = require('../models/boardModel');

module.exports = {
    boardView: function(req, res, next){
        console.log('~~~~~~~~~~~')
        res.render('board/board');
    }

};
