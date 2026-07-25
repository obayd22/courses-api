const express = require("express");
const app = express();

require('dotenv').config();

const httpStatusText = require('./utils/httpStatusText');

const {router: coursesRouter} = require("./routes/courses.route");

const cors = require('cors');

app.use(cors());

app.use(express.json());
// If the request body contains JSON, parse it into a JavaScript object and store it in req.body

app.use("/api/courses", coursesRouter);
// For any request whose URL starts with /api/courses, hand it over to coursesRouter.

// global middleware for 'not found' router
app.use((req, res) => {
    res.status(404).json({status: httpStatusText.ERROR, message: "This resource is not avialable"})
});

//global error handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500)
    .json({
        status: error.statusText || httpStatusText.ERROR,
        message: error.message,
        code: error.statusCode || 500, data: null})
})

const mongoose = require("mongoose");
const url = process.env.MONGO_URL; 

mongoose
  .connect(url)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(process.env.PORT || 4000, () => {
  console.log("Listening on port 4000");
});