const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const { Schema, default: mongoose } = require("mongoose");
const ObjectId = Schema.ObjectId;


const UserSchema = new Schema(
    {
        email: {type: String, unique: true},
        password: String,
        firstName: String,
        lastName: String
    }
)

const AdminSchema = new Schema(
    {
        email: { type: String, unique: true },
        password: String,
        firstName: String,
        lastName: String
    }
)

const CourseSchema = new Schema(
    {
        title: String,
        description: String,
        price: Number,
        imageUrl: String,
        creatorld: ObjectId
         
    }
)

const PerchaseSchema = new Schema(
    {
        userId: ObjectId,
        ceaterId: ObjectId
    }
)


const userModel = mongoose.model('user', UserSchema);
const adminModel = mongoose.model('admin', AdminSchema);
const courseModel = mongoose.model('course', CourseSchema);
const perchaseModel = mongoose.model('perchase', PerchaseSchema);

module.exports = {
    userModel: userModel,
    adminModel: adminModel,
    courseModel: courseModel,
    perchaseModel: perchaseModel
}