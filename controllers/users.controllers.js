const asyncWrapper = require('../middlewares/asyncWrapper');
const User = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generatejwt = require('../utils/generatejwt');


const getAllUsers = asyncWrapper(async (req , res) => {

    const query = req.query; 
    
    const limit = query.limit || 10; 
    const page  = query.page  || 1;
    const skip  = (page - 1) * limit; // {page - 1} not to skip the page i am in
    // remember => we skip elements***

    const users = await User.find({}, {'__v': false, 'password': false}).limit(limit).skip(skip);
    res.json({status: httpStatusText.SUCCESS, data: {users}});
})



const register = asyncWrapper(async (req, res, next) => {
    console.log(req.body);
    const {firstName, lastName, email, password, role} = req.body;

    const oldUser = await User.findOne({email: email});

    if(oldUser) {
        const error = appError.create('user already exists', 400, httpStatusText.FAIL);
        return next(error);
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
       firstName, 
       lastName, 
       email, 
       password: hashedPassword,
       role,
       avatar: req.file.filename
    })
    await newUser.save();

    // generate JWT token
    const token = await generatejwt({email: newUser.email, id: newUser.id, role: newUser.role});
    newUser.token = token;

    res.status(201).json({status: httpStatusText.SUCCESS, data: {user: newUser}}); 
})


const login = asyncWrapper (async (req, res, next) => {
    const {email, password} = req.body;
    
    if(!email&&password) {
        const error = appError.create('email & password are required', 400, httpStatusText.FAIL);
        return next(error);
    }

    const user = await User.findOne({email: email});

    if(!user) {
        const error = appError.create('user not found', 404, httpStatusText.ERROR);
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password); 


    if (user && matchedPassword) {
        // logged in succssefully
        const token = await generatejwt({email: user.email, id: user.id, role: user.role});
        return res.json({status: httpStatusText.SUCCESS, data: {token}})
    } else {
        const error = appError.create('something is wrong', 500, httpStatusText.ERROR);
        return next(error);
    }

})

module.exports = { 
    getAllUsers,
    register,
    login
}