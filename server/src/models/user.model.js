import mongoose,{ Schema }  from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name:{
        type: String,
        required: [true,"Provide name"]
    },
    email:{
        type: String,
        required:[true,"Provide email"],
        unique: true,
    },
    password:{
        type: String,
        required:[true,"Provide password"]
    },
    avatar:{
        type: String,
        default: ""
    },
    mobile:{
        type: Number,
        default: null
    },
    refresh_token:{
        type: String,
        default:""
    },
    verify_email:{
        type: Boolean,
        default: false
    },
    last_login_date:{
        type: Date,
        default: ""
    },
    status:{
        type: String,
        enum:["Active","Inactive","Suspended"],
        default:"Active"
    },
    address_details:[
        {
            type: Schema.Types.ObjectId,
            ref: "Address"
        }
    ],
    shopping_cart:[
        {
            type: Schema.Types.ObjectId,
            ref: "CartProduct"
        }
    ],
    order_histroy:[
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    forgot_password_otp:{
        type: String,
        default:""
    },
    forgot_password_expiry:{
        type: Date,
        default:null
    },
    can_reset_password:{
        type: Boolean,
        default: false
    },
    email_verification_token: { 
        type: String 
    },
    role:{
        type: String,
        enum:["ADMIN","USER"],
        default:"USER"
    }

},{ timestamps: true})


userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
     this.password = await bcrypt.hash(this.password,10)
     next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
   if (!password || !this.password) {
       throw new Error("Missing password for comparison");
   }  
   return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id   
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const UserModel = mongoose.model("User",userSchema)