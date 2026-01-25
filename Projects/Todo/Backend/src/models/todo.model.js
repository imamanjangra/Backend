import mongoose , {Schema} from "mongoose";

const todoSchema = new Schema({
    todoTitle: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["complete" , "pending"],
        default: "pending"
    },
   priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
} , {timestamps: true})

export const Todo = mongoose.model("Todo" , todoSchema) 