const express = require('express');

const {body} = require("express-validator");

const router = express.Router();

const courseController = require('../controllers/courses.controller');

const verifyToken = require('../middlewares/verifyToken');

const {validationSchema} = require('../middlewares/validationSchema')

router.route('/')
    .get(courseController.getAllCourses)
    .post(verifyToken, validationSchema(), courseController.addCourse)

router.route('/:courseID')
    .patch(courseController.updateCourse)
    .delete(courseController.deleteCourse )
    .get(courseController.getCourse)


module.exports = router;