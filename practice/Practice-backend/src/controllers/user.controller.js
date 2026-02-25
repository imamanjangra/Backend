import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async (userID) => {
    try {
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken , refreshToken}
    } catch (error) {
        return res.status(500 , "somthing went wrong while generating refresh and access token ");
    }
}

 const registerUser = async (req , res ) => {
    const {FullName , email , username , password } = req.body;

    if([FullName , email , username , password ].some( (value) => value?.trim() === "")){
        return res.status(400).json({message : "All fileds are required"});
    }

const existedUser = await User.findOne({
    $or : [{username} , {email}]
})

if(existedUser){
    return res.status(409).josn({message : "user is already exist"});
}

const user = await User.create({
    FullName,
    email,
    password,
    username
})

const createdUser = await User.findById(user._id).select("-password -refreshToken");

if(!createdUser){
    return res.status(500).json({message : "Somthing went wrong rigister user "});
}
res.status(201).json(createdUser)

}
 
const loginUser = async (req , res ) => {

const {email , username , password} = req.body;

if([username , email , password].some((value) => value?.trim === "")){
    return res.status(400).json({message : "All filed are required "})
}


const user = await User.findOne({
    $or : [{username} , {email}]
})

if(!user){
    return res.status(404).json({message : "User no found"});
}

const isPasswordValid = await user.isPasswordCorrect(password);

if(!isPasswordValid){
    return res.status(401).json({message : "Password is not valid "});
}

const {accessToken , refreshToken} = await generateAccessAndRefereshTokens(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

const options = {
    httpOnly : true,
    secure : true,
}

return res.status(200)
.cookie("accessToken" , accessToken , options)
.cookie("refreshToken" , refreshToken , options)
.json(
    {user : loggedInUser , accessToken , refreshToken}
)
}

const logoutUser = async (req , res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        },
    )

    const options = {
        httpsOnly : true,
        secure : true,
    }

    return res.status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json({message : "User Logged out successfuly "})
}

const refreshAccessToken = async (req , res) => {
    const incomingRefreshToken = await req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        return res.status(401).json({message : "unauthorized request "})
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken ,
            process.env.REFRESH_TOKEN_SECRET,
        )

        const user = await User.findById(decodedToken?._id);

        if(!user){
            return res.status(401).josn({message : "Invalid refresh token"})
        }

        if(incomingRefreshToken != user?.refreshToken){
            return res.status(401).json({message : "Refresh token is expired or used"})
        }

        const options = {
      httpOnly: true,
      secure: true
     }

     const {accessToken , newrefreshToken} = await generateAccessAndRefereshTokens(user._id)

     return res
     .status(200)
     .cookie("accessToken" , accessToken , options )
     .cookie("refreshToken" , newrefreshToken , options)
     .json({accessToken , refreshToken: newrefreshToken})

    } catch (error) {
        return res.status(401).josn({message : "Invalid user token "});
    }

}

export {registerUser , loginUser , logoutUser , refreshAccessToken}