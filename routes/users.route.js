const express = require('express');

const router = express.Router();

const userController = require('../controllers/users.controllers');

// register 

// login

router.route('/')
    .get(userController.getAllUsers)

router.route('/register') 
    .post(userController.register)

router.route('/login') 
    .post(userController.login)


module.exports = router;