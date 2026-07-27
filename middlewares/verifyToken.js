const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']; 

    if(!authHeader) {
        const error = appError.create('token is required', 401, httpStatusText.ERROR);
        return next(error);
    }
    const token = authHeader.split(' ')[1]; // split to ignore the bearer

    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        // here we manipulated the req body & added a the value of currentUser 
        // this new value will be avail for any middleware AFTER verifyToken
        next();
    } catch(err) {
        const error = appError.create('This user is not authorized', 401, httpStatusText.ERROR);
        return next(error);
}
    
}


module.exports = verifyToken; 