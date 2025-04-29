import { DB_NAME } from "../constants.js";
import { mongoose } from "mongoose";

const connectDB = async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log("MONGODB CONNECTED:")
    } catch (error) {
        console.log("MONGODB Connection Failed:",error);
        process.exit(1)
    }
}

export default connectDB