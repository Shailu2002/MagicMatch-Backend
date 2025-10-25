const mongoose = require("mongoose");
const signschema = new mongoose.Schema(
    {
        user_id:
        {
            type: String,
            required:true
        },
        user_name:
        {
            type:String,
            required:true
        },
        user_age:
        {
            type: Number,
            required:true
        },
        user_gender:
        {
            type: String,
            required:true
        },
        user_religion:
        {
            type: String,
            required:true
        },
        user_caste:
        {
            type: String
        },
        user_marital:
        {
            type: String,
            required:true
        },
        user_mtongue:
        {
            type: String,
            required:true
        },
        user_about_yourself:
        {
            type: String,
            required:true
        },
        user_premium_status:
        {
            type: Number,
            required:true
        },
        user_no_of_invitation_sent:
        {
            type: Number,
            required:true
        },
        user_no_of_invitation_received:
        {
            type: Number,
            required:true
        },
        user_country:
        {
            type: String,
            required:true
        },
        user_state:
        {
            type: String,
            required:true
        },
        user_city:
        {
            type: String,
            required:true
        }
       
    }

);
const User_Personal_Details = new mongoose.model("User_Personal_Details",signschema);
module.exports = User_Personal_Details;