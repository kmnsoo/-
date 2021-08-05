const multer = require("multer");
const path = require("path");
const sess = require('../zSession');
const fs = require('fs');

const _PATH = 'public/upload/';

let storage = multer.diskStorage({
    destination: function(req, file ,callback){
        const path = _PATH;
        //#endregionlet uploadType = req.baseUrl.replace(/\//g,'').toUpperCase();
        const uploadPath = path;
        
        if(fs.existsSync(uploadPath)){
            console.log('directory exists');
        }else{
            console.log('create directory does not exist');
            fs.mkdir('./'+uploadPath, 0666, function(err){
                if(err) throw err;
            });
        }
        
        callback(null, uploadPath);
    },
    filename: function(req, file, callback){
        let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extension);
        callback(null, req.baseUrl.replace(/\//g,'')+"" + Date.now() + extension);
    }
});

module.exports = {   
    storage: storage,   
}