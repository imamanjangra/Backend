import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

// app use

app.use(
    cors({
        origin: process.env.CROS_ORIGEN,
        credentials: true
    })
)

app.use(express.json({limit: "16KB"}))
app.use(express.urlencoded({extended: true, limit: "16KB"} ))
app.use(express.static("public"))
app.use(cookieParser())

// app routes

import userRoutes from "./routes/userRoutes.js"
app.use("/api/v1/users" , userRoutes)

import todoRoutes from "./routes/todoRoutes.js"

app.use("/api/v1/todos" , todoRoutes)

export {app}