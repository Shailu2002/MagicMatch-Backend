const mongoose = require("mongoose");
const PlanSchema = new mongoose.Schema(
    {
        P_name:{
            type: String,
            required:true
        },
        P_duration:
        {
            type: Number,
            required:true
        },
        P_op:
        {
            type: String,
            required:true
        },
        P_amount:
        {
            type: Number,
            required:true
        },
        P_description:
        {
            type: String,
            required:true
        },
        enable:
        {
            type:Number,

        },
        P_discount:
        {
            type: Number,
            required:true

        }
    }
);
const Plan= new mongoose.model("Plan", PlanSchema);
module.exports = Plan;