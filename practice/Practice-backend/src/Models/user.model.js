import mongoose , {Schema} from "mongoose";

const userSchema = new Schema({
    username : {
        type : String,
        lowercase : true,
        required : true,
        unique : true,
        trim : true,
        index : true,
    },
    FullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        lowercase : true,
        required : true,
        unique : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        trim : true,
    },
     refreshToken: { 
            type: String,
        }

} , {timestamps : true});

export const User = mongoose.model("User" , userSchema)