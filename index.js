require('dotenv').config();
console.log(process.env.MONGO_DB_URL);

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { userRouter } = require("./routes/user");
const { x } = require("./routes/admin");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);



async function main() {
    await mongoose.connect(process.env.MONGO_DB_URL);
    app.listen(3000); 
    console.log("Connected to data base");
    
}
main();

