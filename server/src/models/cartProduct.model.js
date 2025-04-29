import mongoose,{Schema} from "mongoose"

const cartProductSchema = new Schema({
     productId:{
        type: Schema.Types.ObjectId,
        ref:"Product",
        required: true
     },
     quantity:{
        type: Number,
        default: 0
     },
     userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
     },
},{timestamps: true})

export const CartProductModel = mongoose.model("CartProduct",cartProductSchema)