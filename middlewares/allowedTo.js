module.exports = (...roles) => {
    // ["ADMIN", "MANAGER"]
    return (req, res, next) => {
        if(roles.includes(req.currentUser.role)) {
            const error = appError.create('This role is not authorized', 401);
        }
        next();
    }
}