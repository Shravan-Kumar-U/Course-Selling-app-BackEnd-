// const express = require("express");
// const Router = express.Router;
const { Router } = require("express");

const courseRouter = Router();

courseRouter.get("/purchases", function(req, res){
    res.json({
        message: "You can see here the perchased course"
    })
})

courseRouter.get("/preview", function(req, res){

})

module.exports = {
    courseRouter: courseRouter
}

