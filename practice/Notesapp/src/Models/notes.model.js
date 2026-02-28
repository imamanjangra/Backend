import mongoose , {Schema} from "mongoose";

const notesSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true,
    },
    isPinned : {
        type : Boolean,
        default : false
    },
    isArchived : {
        type : Boolean,
        default : false,
    },
    tags : {
        type : [String],
        default : []
    },
    isDeleted : {
        type : Boolean,
        default : false,
    },
    userID : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    folderID : {
        type : Schema.Types.ObjectId,
        ref : "Folder"
    }
} , {timestamps : true})

notesSchema.index({
  title: "text",
  content: "text",
  tags: "text"
});

export const Notes = mongoose.model("Notes" , notesSchema)

