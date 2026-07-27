const express = require('express');

const {body} = require("express-validator");

const router = express.Router();

const courseController = require('../controllers/courses.controller');

const verifyToken = require('../middlewares/verifyToken');

const {validationSchema} = require('../middlewares/validationSchema');

const userRole = require('../utils/user.roles');

const allowedTo = require('../middlewares/allowedTo');

router.route('/')
    .get(courseController.getAllCourses)
    .post(verifyToken, validationSchema(), courseController.addCourse)

router.route('/:courseID')
    .patch(courseController.updateCourse)
    .get(courseController.getCourse)
    .delete(verifyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), courseController.deleteCourse)


module.exports = router;