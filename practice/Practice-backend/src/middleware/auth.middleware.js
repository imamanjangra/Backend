import jwt, { decode } from "jsonwebtoken";
import User from "../Models/user.model.js";

// export const Protect = async(req , res , next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer" , "")

//         if(!token){
//             return res.status(401).json({ message: "Unauthorized request" });
//         }

//         const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

//         if(!user){
//             return res.status(401).json({message : "Invalid access Token"})
//         }

//         req.user = user;
//         next()
//     } catch (error) {
//         return res.status(401).json({message : "Invalid access Token"})
//     }
// }

export const Protect = async (req , res , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer" , "");

        if(!token){
            return res.status(401).json({message : "Unauthorized request"});
        }

        const decodedToken = jwt.verify(token , process.evn.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        req.user = user
        next();
    } catch (error) {
        return res.status(401).json({message : "INvalid user token"})
    }
}