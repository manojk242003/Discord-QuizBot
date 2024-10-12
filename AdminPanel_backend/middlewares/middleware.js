const jwt=require("jsonwebtoken")
const {JWT_SECRET} = require("../config")

const authMiddleware=(req,res,next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        return res.status(403).json({
            msg :"token not found"
        })
    }

    const jwt_token = authHeader.split(' ')[1];
    

    try {
        const decoded=jwt.verify(jwt_token,JWT_SECRET)
        if(decoded.userId)
        {
            req.userId=decoded.userId
            next()
        }
        else
        {
            return res.status(403).json({
                msg : "jwt verification failed"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            error :"error occured"
        })
    }

}

module.exports={authMiddleware}