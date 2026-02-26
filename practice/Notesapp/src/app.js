import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "16KB"}));
app.use(express.urlencoded({extended : true , limit : "16KB"}));
app.use(express.static("public"))
app.use(cookieParser())

import userRoute from "./routes/user.route.js";
import notesRoute from "./routes/notes.routes.js"

app.use("/api/v1/users" , userRoute);
app.use("/api/v1/notes" , notesRoute)

export {app}