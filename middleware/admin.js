const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req, res, next){
    const token = req.headers.token;
    const decdedData = jwt.verify(token, JWT_ADMIN_PASSWORD);
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
    adminMiddleware: adminMiddleware
}