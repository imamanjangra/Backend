import mongoose , {Schema} from "mongoose";


const todoSchema = new Schema({
    todo:{
        type: String,
        required: true,
    },
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["pending" , "compeleted"],
        default: "pending"
    }
} , {timestamps: true})

export const Todo = mongoose.model("Todo" , todoSchema)