import {app} from "./app.js"
import connectDB from "../src/db/index.js"
import dotenv from "dotenv"




dotenv.config({
    path: "./.env"
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000  , () => {
        console.log("Server is runing at a port of :",process.env.PORT );
    })
})
.catch((error) => {
    console.log("MONGODO connection is FAILED!!" , error);
})
