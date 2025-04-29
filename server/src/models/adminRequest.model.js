import mongoose,{Schema} from "mongoose"

const adminRequestSchema = new Schema({
     user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true
     },
},{timestamps: true})

export const AdminRequestModel = mongoose.model("AdminRequest", adminRequestSchema)