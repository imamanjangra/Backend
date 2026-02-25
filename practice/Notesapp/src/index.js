import { app } from "./app.js";
import  {ConnectDB}  from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

ConnectDB()
.then(() => {
    app.listen(process.env.PORT || 8000  ,() => {
        console.log(`Server is Running at a Port at :) = ${process.env.PORT}`);
    })
}).catch((err) => {
    console.log(`Failed to listen App :( = ` , err);
});
