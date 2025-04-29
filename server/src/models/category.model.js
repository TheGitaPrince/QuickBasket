import mongoose,{Schema} from "mongoose"

const categorySchema = new Schema({
       name:{
         type: String,
         default:""
       },
       image:{
         type: String,
         default:""
       }
},{timestamps: true})

export const CategoryModel = mongoose.model("Category",categorySchema)