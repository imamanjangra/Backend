import {User} from "../models/user.model.js"
import jwt, { decode } from "jsonwebtoken"

export const protect = async(req , res , next) => {

    let token;
    if(req.header.authorization && req.header.authorization.startWith("Bearer")){
        try {
            token = req.header.authorization.split(" ")[1];

            const decoded = jwt.verify(token , process.env.JWT_SECRET)

            const user = await User.findById(decoded.id).select("-password")

            if(!user){
                return res.status(401),json({
                    message : "User not found !! "
                })
            }

            req.user = user;
            return next();
            
        } catch (error) {
            return res.status(401).json({
                message : "not authorization User !!"
            })
        }
    }
    
    return res.status(401).json({
        message : "not authorization User !!"
    })
}

