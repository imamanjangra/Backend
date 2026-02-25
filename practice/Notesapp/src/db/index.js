import mongoose from "mongoose";

export const ConnectDB = async() => {
    const DB_NAME = "Notes"
    try {
        const connect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connect succesfully :) || Host : ${connect.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection is Failed :( = " ,error);
    }
}