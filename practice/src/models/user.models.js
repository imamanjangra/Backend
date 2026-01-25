import mongoose , {Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type : String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }

} , {timestamps: true})

userSchema.pre('save', async function (req, res, next) {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

export const User = mongoose.model("User" , userSchema)

