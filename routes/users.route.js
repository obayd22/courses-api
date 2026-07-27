const express = require('express');

const router = express.Router();

const userController = require('../controllers/users.controllers');

const verifyToken = require('../middlewares/verifyToken');

const multer = require('multer');
const appError = require('../utils/appError');

const diskStorage = multer.diskStorage({
    destination: function(res, file, cb) {
        console.log("File:" , file);
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`
        cb(null, fileName);
    }
})

// only accept images 
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];

    if(imageType === 'image'){
        return cb(null, true)
    } else {
        return cb(appError.create('file must be an iamge', 400), false )
    }
}

const upload = multer({
    storage: diskStorage, 
    fileFilter
});
// register 

// login

router.route('/')
    .get(userController.getAllUsers)

router.route('/register') 
    .post(upload.single('avatar'), userController.register)

router.route('/login') 
    .post(userController.login)


module.exports = router;