const { Router } = require("express");
const adminRouter = Router();
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { adminModel } = require("../db");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const { courseModel } = require("../db");


adminRouter.post("/signup", async function(req, res){
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
    //Here I'am not store the plane password of the user in MongoDb. Because when ever my Db crashes everyone can see the password of the user. To over come the problem i need to hash the password . Here i was using the bcrypt library to hash the plane text password to unreadable password adding some solt to it
    let isError = false;
    try{
        //While storing the userdata in MongoDb it may throw an error because if someone has entered an existing email. If user enter the existing email backend will crash. To overcome this I know this part will may throw an error so it include try catch here
        const hashedPassword = await bcrypt.hash(password, 7);
        console.log(hashedPassword);
        await adminModel.create({
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

adminRouter.post("/signin", async function(req, res){
    const { email, password } = req.body;
    const user = await adminModel.findOne({
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
            id: user._id
        },JWT_ADMIN_PASSWORD);

        res.json({
            token: token
        })
    }else{
        res.status(404).json({
            message : "Incorrect Credentials"
        })
    }
})

adminRouter.post("/course", adminMiddleware, async function(req, res){
    const adminId = req.userId;
    const { title, description, price, imageUrl } = req.body;
    const course = await courseModel.create({
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
        creatorld: adminId
    })
    res.json({
        message: "Course is created",
        courseId: course._id
    })
})

adminRouter.put("/course", adminMiddleware, async function(req, res){
    const adminId = req.userId;
    const { title, description, price, imageUrl, courseId } = req.body;

    const course = await courseModel.updateOne({
        //This is used to only for the admin who is the admin for this code. Not for the all the admins who created the course
        //It will confirm that the adminId should match to the adminId which is the owner of this course.
        //Only the admin of this course can able to update the course. Not for the other admins 
        _id: courseId,
        creatorld: adminId
    }, {
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
        creatorld: adminId
    })
    res.json({
        message: "Course Updated",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res){
    const adminId = req.userId
    const courses = await courseModel.find({
        creatorld: adminId
    })
    res.json({
        message: "Course Updated",
        courses
    })
})


module.exports = {
    adminRouter: adminRouter
}