import cookieParser from "cookie-parser"
import express from "express"


const app = express()

//app use

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials:true
    })
)

app.use(express.json({limit: "16KB"}))
app.use(express.urlencoded({extended: true , limit: '16KB'}))
app.use(express.static("public"))
app.use(cookieParser())

//routes



export {app}


