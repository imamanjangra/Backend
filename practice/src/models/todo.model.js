import mongoose , {Schema} from "mongoose";


const todoSchema = new Schema({
    todoTitle:{
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
        enum: ["pending" , "completed"],
        default: "pending"
    }
} , {timestamps: true})

export const Todo = mongoose.model("Todo" , todoSchema)

export default Todo;
