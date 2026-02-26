import mongoose , {Schema} from "mongoose";

const folderSchema = new Schema({
    userID : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    name : {
        type : String,
        required : true,
    },
    
} , {timestamps : true});

export const Folder = mongoose.model("Folder" , folderSchema);
