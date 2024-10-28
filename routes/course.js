// const express = require("express");
// const Router = express.Router;
const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { perchaseModel, courseModel } = require("../db");


const courseRouter = Router();

courseRouter.get("/purchases", userMiddleware, async function(req, res){
    const userId = req.userId;
    const courseId = req.body.courseId;
    await perchaseModel.create({
        userId: userId,
        courseId: courseId
    })
    res.json({
        message: "You can see here the perchased course"
    })
})

courseRouter.get("/preview", async function(req, res){
    const course = await courseModel.find({});
    res.json({
        course
    })
})

module.exports = {
    courseRouter: courseRouter
}

