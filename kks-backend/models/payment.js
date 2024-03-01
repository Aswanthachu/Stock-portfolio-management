import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    mihpayid: {
      type: String,
    },
    mode: {
        type:String,
    } ,
    status: {
        type:String,
        required:true
    } ,
    unmappedstatus: {
        type:String,
    } ,
    key: {
        type:String,
       
    } ,
    txnid: {
        type:String,
        required:true,
        unique: true,
        dropDups:true
    } ,
    amount: {
        type:String,
        required:true
    } ,
    discount: {
        type:String,
    } ,
    net_amount_debit: {
        type:String,
    } ,
    productinfo: {
        type:String,
        required:true
    } ,
    firstname: {
        type:String,
        required:true
    } ,
    lastname: {
        type:String,
    } ,
    email: {
        type:String,
        required:true
    } ,
    phone: {
        type:String,
    } ,
    udf1: {
        type:String,
    } ,
    hash:{
        type:String,
    } ,
    payment_source: {
        type:String,
    } ,
    PG_TYPE:  {
        type:String,
    } ,
    bank_ref_num: {
        type:String,
    } ,
    bankcode:  {
        type:String,
    } ,
    error:  {
        type:String,
    } ,
    error_Message:  {
        type:String,
    } ,
    couponCode:{
       type: String,
       default:""
    },
    status: {
      type: String,
      required: true,
    },
    unmappedstatus: {
      type: String,
    },
    key: {
      type: String,
    },
    txnid: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
    },
    amount: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
    },
    net_amount_debit: {
      type: String,
    },
    productinfo: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    udf1: {
      type: String,
    },
    hash: {
      type: String,
    },
    payment_source: {
      type: String,
    },
    PG_TYPE: {
      type: String,
    },
    bank_ref_num: {
      type: String,
    },
    bankcode: {
      type: String,
    },
    error: {
      type: String,
    },
    error_Message: {
      type: String,
    },
    couponCode: {
      type: String,
      default: "",
    },
    couponDiscount: {
      type: String,
      default: "",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

paymentSchema.virtual("user", {
  ref: "user",
  foreignField: "_id",
  localField: "udf1",
});
const payment = mongoose.model("payment", paymentSchema);

export default payment;
