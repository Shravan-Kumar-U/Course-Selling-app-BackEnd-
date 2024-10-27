const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
function userMiddleware(req, res, next){
    const token = req.headers.token;
    const decdedData = jwt.verify(token, JWT_USER_PASSWORD);
    if(decdedData){
        req.userId = decdedData.id;
        next();
    }else{
        res.status(403).json({
            message: "You are not signed in"
        })
    }

}

module.exports = {
    userMiddleware: userMiddleware
}