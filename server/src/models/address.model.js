import mongoose, {Schema} from "mongoose"

const addressSchema = new Schema({
    address_line : {
        type : String,
        default : ""
    },
    city : {
        type : String,
        default : ""
    },
    state : {
        type : String,
        default : ""
    },
    pincode : {
        type : String
    },
    country : {
        type : String
    },
    mobile : {
        type : Number,
        default : null
    },
    status : {
        type : Boolean,
        default : true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
     }
},{ timestamps : true })

export const AddressModel = mongoose.model("Address", addressSchema)