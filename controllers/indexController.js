let config = require('../config');
let indexModel = require('../models/indexModel');

module.exports = {
    main: function (req, res, next) {
        res.render('main');
    },
    testDB: function(req, res, next) {
        let params = req.body;
        indexModel.testDB(params, (result) => {
            res.render(result)
        })
    },

};
