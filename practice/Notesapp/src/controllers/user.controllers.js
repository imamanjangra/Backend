import {User} from "../Models/user.model.js";
import { Notes } from "../Models/notes.model.js";
import jwt from "jsonwebtoken"

export const generateAccessAndRefereshTokens = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false});

    return {accessToken , refreshToken}
}

export const RigisterUser = async (req , res) => {
   try {
     const {FullName , username , email , password } = req.body;
 
     if([FullName , username , email ].some((fildes) => fildes.trim() == "")){
         return res.status(401).json({message : "All fildes are required"});
     }
 
     const existedUser = await User.findOne({
         $or: [{username} , {email}]    
     })
 
     if(existedUser) {
         return res.status(409).json({message : "User is already exsited ;("})
     }
 
 
     const user = await User.create({
         FullName : FullName,
         username : username,
         email : email,
         password : password,
     })
 
     const createdUser = await User.findById(user._id).select("-password -refreshToken")
 
     return res.status(200).json({message : "User created successfuly :) " , createdUser})
 
   } catch (error) {
        return res.status(401).json({message : `failed to create user :  ${error}`})

   }
}   

export const LoginUser = async (req , res) => {
   try {
     const {email , username , password} = req.body;
 
    if ((!email && !username) || !password) {
    return res.status(400).json({
        message: "Email or username and password are required"
    });
}
 
     const user = await User.findOne({
         $or : [{username} , {email}]
     })
 
     if(!user){
         return res.status(404).json({message : "User is not found "});
     }
 
     const PasswordCheck = await user.isPassworCorrect(password);

     if(!PasswordCheck){
         return res.status(400).json({message : "Password and Username is not correct :( "})
     }
 
     const {accessToken , refreshToken} = await generateAccessAndRefereshTokens(user._id);
 
     const logginUser = await User.findById(user._id).select("-password -refreshToken");
 
     const options = {
         httpOnly : true,
         secure : true
     }
     
     return res.status(200)
     .cookie("accessToken" , accessToken , options)
     .cookie("refreshToken" , refreshToken , options)
     .json({message : "Login user successfuly " , user : logginUser , accessToken , refreshToken})
     
 
 
     // return res.status(200).json({message : "User login successfuly " , user});
   } catch (error) {
        return res.status(401).json({message : `failed to login user :  ${error}`})

   }
}

export const LogoutUser = async (req , res) => {
   try {
     await User.findByIdAndUpdate(
         req.user._id,
         {
            $set : {
             refreshToken : undefined,
            }
         },
         {
             new : true
         }
     )
 
      const options = {
         httpOnly : true,
         secure : true
     }
 
     return res.status(200)
     .clearCookie("accessToken" , options)
     .clearCookie("refreshToken" , options)
     .json({message : "User Logout successfuly "})
 
   } catch (error) {
    return res.status(401).json({message : `failed to Logout user :  ${error}`})
   }
}

export const refreshAccessToken = async (req , res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        return res.status(401).json({message : "unauthorized request"});
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_EXPIRY)

        const user = await User.findById(decodedToken._id);

         if(!user){
        return res.status(401).json({message : "User is not found "});
        }

        if(incomingRefreshToken != user.refreshToken){
            return res.status(401).json({message : "Token is used or expired "})
        }

         const options = {
            httpOnly : true,
            secure : true
        }

        const {accessToken , newRefreshToken} = await generateAccessAndRefereshTokens(user._id);

        res.status(200)
        .cookie("accessToken" , accessToken , options)
        .cookie("refreshToken" , newRefreshToken , options)
        .json({message : "refresh token is updated " , accessToken ,   newRefreshToken})


    } catch (error) {
        return res.status(401).json({message : "Invalid access Token"})
    }
}

export const changeCurrentPassword = async (req , res) => {
    try {
        const {oldPassword , newPassword} = req.body;

        if(!(oldPassword || newPassword)){
            return res.status(401).json({message : "All filed are required "});
        }

        const user = await User.findById(req.user._id);
        const checkPassword = await user.isPassworCorrect(oldPassword);

        if(!checkPassword){
            return res.status(400).json({message : "Password is wrong !!"})
        }
        user.password = newPassword;

        await user.save({validateBeforeSave : false});

        return res.status(200).json({messsage : "Password is updated Succfully "});
    } catch (error) {
        return res.status(400).josn({message : "Somthing unexcpted "})
    }
}

export const getuserData = async (req , res) => {
    return res.status(200).json({message : "Fetch user data successfully" ,  user: req.user })
}

export const updateUserInfo = async (req , res) => {
    try {
        const {FullName , email} = req.body;

        if(!FullName || !email) {
            return res.status(401).json({message : "Enter data to update "});
        }
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set : {
                    FullName,
                    email
                }
            },
            {
                    new : true,
            }
        ).select("-password");

        res.status(200).json({message : "user detail is update"} , user);

    } catch (error) {
        res.status(400).json({message : "somthing went wrong"} , error);
    }
}

// export const NotesCount = async (req , res) => {
//         const notes = await Notes.aggregate(
//             {
//                 $group : {
//                     _id : "$userID",
//                     totalNotes : {$sum : 1}
//                 }
//             }
//         )

//         return res.status(200).json({message : "Total no of Notes = " } , notes)
// }
