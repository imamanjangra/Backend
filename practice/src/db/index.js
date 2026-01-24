import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";



const connectDB = async() => {
    try {
        const cnt = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MONGODB connected !! || Host: ${mongoose.connection.host}`)

    } catch (error) {
        console.log("MONGOOSE connection FAILED" , error);
        process.exit(1)
    }
}

export default connectDB