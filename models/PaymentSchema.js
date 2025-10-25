const mongoose = require("mongoose");
const payschema = new mongoose.Schema(
    {
        user_id:
        {
            type: String,
            required:true
        },
        transaction_id:
        {
            type:String,
            required:true
        },
        total_amount:
        {
            type:Number,
            required:true
        },
        plan_name:
        {
            type: String,
            required:true
        },
        plan_duration:
        {
            type: String,
            required:true
        },
        approval_status:
        {
            type: Number,
            required:true
        },
        active_status:
        {
            type: Boolean,
            required:true
        },
        
        payment_date:
        {
            type: Date,
            required:true
        },
        amount_received:
        {
            type: Number,
            required:true
        },
        user_email_id:
        {
            type: String,
            required:true
        }
    }

);
const User_Payment = new mongoose.model("User_Payment",payschema);
module.exports = User_Payment;