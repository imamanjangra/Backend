import mongoose from "mongoose";

const DB_NAME = "learningDB"

const connectDB = async() => {
    try {
        const connectDB = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MONGODB connected !! Host ${connectDB.connection.host}`);
    } catch (error) {
        console.log('connected is failed : ' , error );
        process.exit(1)
    }
}

export default connectDB

