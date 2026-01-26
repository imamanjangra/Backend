import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const registerUser = async(req , res) => {
    try {
        const {name , email , password} = req.body;

        if([name , email , password].some(val => val?.trim() === "")){
            return res.status(400).json({ message: 'All field are required' });

        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(409).json({ message: 'user is already exists' });
        }

        const user = await User.create({name , email , password})

        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            token : jwt.sign({id : user._id} , process.env.JWT_SECRET , {expiresIn: '3d'})
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'failed to register user ' });
    }
}

export const loginUser = async(req , res) => {
    try {
       const {email , password} = req.body;
       const user = await User.findOne({email}) 

       const passwordCheckd = await bcrypt.compare(password , user.password)

       if(user && passwordCheckd){
        res.json({
            _id: user._id,
            name : user.name,
            email: user.email,
            token: jwt.sign({id : user._id} , process.env.JWT_SECRET , {expiresIn: '1d'})
        })
       }
    } catch (error) {
         res.status(401).json({ message: "Failed to Login user !! " })
    }
}