import mongoose,{Schema} from "mongoose"

const orderSchema = new Schema({
     userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
     },
     orderId:{
        type: String,
        required:[true,"Provide orderId"],
        unique: true
     },
     productId:{
        type: Schema.Types.ObjectId,
        ref:"Product"
     },
     product_details:{
        name: String,
        image: Array
     },
     payment_id:{
        type:String,
        default:""
     },
     payment_status:{
        type: String,
        default:""
     },
     delivery_address:{
        type: Schema.Types.ObjectId,
        ref:"Address"
     },
     delivery_status:{
        type: String,
        default:""
     },
     subTotalAmt:{
        type:Number,
        default: 0
     },
     totalAmt:{
        type: Number,
        default:0
     },
     invoice_receipt:{
       type: String,
       default:""
     }

},{timestamps: true})

export const OrderModel = mongoose.model("Order",orderSchema)