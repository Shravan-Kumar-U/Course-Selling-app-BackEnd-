const { Router } = require("express");
const userRouter = Router();
const { userModel } = require("../db");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_USER_PASSWORD } = require("../config");
const { perchaseModel } = require("../db");

userRouter.post("/signup", async function(req, res){
    //Input validation(Authentication) using Zod library
    const requireBody = z.object({
        email: z.string().min(5).max(50).email(),
        password: z.string().min(5).max(20),
        firstName: z.string().min(3).max(10),
        lastName: z.string().min(3).max(10)
    })
    //const parseData = requireBody.parse(req.body);
    //Here the below the code is used to check whether the user has followed the above manner while signing in
    const parseData = requireBody.safeParse(req.body);
    
    //This code \|/(below code) is to tell the user that user did a mistake while siging in 
    if(!parseData.success){
        res.json({
            message: "Please follow the manner which is mentioned",
            error: parseData.error
        })
    }

    //If the user has put the requirment correctly next is to store users information in database
    //to get the user information form the user
    // const email = req.body.email;
    // const password = req.body.password;
    // const firstName = req.body.firstName;
    // const lastName = req.body.lastName;
    //alternative code below Destructed the above code
    const { email, password, firstName, lastName } = req.body;

    let isError = false;
    try{
        const hashedPassword = await bcrypt.hash(password, 7);
        console.log(hashedPassword);
        userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName  
        })
    }catch(e){
        isError = true;
        res.json({
            message: "This username is already exists. Change your email"
        })
    }
    if(!isError){

        res.json({
            message: "You are signed up"
        })
    }
    
})

userRouter.post("/signin", async function(req, res){
    const { email, password } = req.body;
    const user = await userModel.findOne({
        email: email
    })

    if(!user){

        res.json({
            message : "User in this email does'nt  exist in our data base"
        })
        return;
    }
    //By using bcrypt hashing method i am checking whether the user's hashed password is same as the password which is stored in the database 
    const passwordMatch = await bcrypt.compare(password, user.password);

    if(passwordMatch){
        console.log({
            id: user._id.toString()
        });
        
        //If users password is same as the password which is stored in the database, then send a token to the user
        const token = jwt.sign({
            id: user._id.toString()
        },JWT_USER_PASSWORD);

        res.json({
            token: token
        })
    }else{
        res.status(404).json({
            message : "Incorrect Credentials"
        })
    }   

})

userRouter.post("/purchases", async function(req, res){
    const userId = req.userId;
    const perchase = await perchaseModel.find({
        userId
    })
    req.json({
        perchase
    })


})



module.exports = {
    userRouter: userRouter
}