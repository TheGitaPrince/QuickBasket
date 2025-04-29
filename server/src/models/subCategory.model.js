import mongoose,{Schema} from "mongoose"

const subCategorySchema = new Schema({
    name:{
        type: String,
        default:""
      },
      image:{
        type: String,
        default:""
      },
      categoryId:[
        {
          type: Schema.Types.ObjectId,
          ref: "Category"
        }
     ]
},{timestamps: true})

export const SubCategoryModel = mongoose.model("SubCategory",subCategorySchema)