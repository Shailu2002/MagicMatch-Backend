//step 4 table banana database me 
const mongoose = require("mongoose");
const signschema = new mongoose.Schema(
    {
        user_name:
        {
            type: String,
            required: true,
            trim:true
        },
        user_email:
        {
            type: String,
            required: true,
            trim:true
        },
        user_feedback:
        {
            type: String,
            required:true
        },
        user_ratings:
        {
            type:Number,
            required:true
        }
    }
);
const user_feedback = new mongoose.model("user_feedback",signschema);
module.exports = user_feedback;