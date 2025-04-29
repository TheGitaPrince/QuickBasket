import dotenv  from "dotenv";
import { app } from "./app.js";
import connectDB  from "./db/index.js";

dotenv.config({
    path: "./.env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on http://localhost:${process.env.PORT || 8000}`);
    })
    app.on("error",(error)=>{
        console.log("ERROR",error)
        throw error
    })
})
.catch((error)=>{
    console.log("MONGODB Connection Failed:",error);
})

