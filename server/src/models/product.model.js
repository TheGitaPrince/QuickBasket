import mongoose,{Schema} from "mongoose"

const productSchema = new Schema({
       name:{
         type:String,
       },
       image:{
         type: Array,
         default:[]
       },
       categoryId:[
          {
            type: Schema.Types.ObjectId,
            ref: "Category"
          }
       ],
       sub_categoryId:[
           {
            type: Schema.Types.ObjectId,
            ref: "SubCategory"
           }
       ],
       unit:{
         type: String,
         default:""
       },
       stock:{
         type: Number,
         default: 0
       },
       price:{
         type: Number,
         default: null
       },
       discount:{
         type: Number,
         default: null
       },
       description:{
         type: String,
         default:""
       },
       more_details:{
          type: Object,
          default:{}
       },
       publish:{
         type: Boolean,
         default: true
       }
},{timestamps: true})

export const ProductModel = mongoose.model("Product",productSchema)