const mongoose = require("mongoose");
const signschema = new mongoose.Schema(
    {
        user_id:
        {
            type: String,
            required:true
        },
        user_height:
        {
            type:String,
            required:true
        },
        user_blood_group:
        {
            type: String
        },
        user_body_type:
        {
            type: String
        },
        user_complexion:
        {
            type: String
        },
        user_diet:
        {
            type: String,
            required:true
        },
        user_hobbies:
        {
            type: Array,
            required:true
        }
    }

);
const User_General_Details = new mongoose.model("User_General_Details",signschema);
module.exports = User_General_Details;