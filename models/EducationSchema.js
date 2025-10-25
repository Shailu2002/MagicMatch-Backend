const mongoose = require("mongoose");
const signschema = new mongoose.Schema(
    {
        user_id:
        {
            type: String,
            required:true
        },
        user_highest_qualification:
        {
            type:String,
            required:true
        },
        user_working_with:
        {
            type: String,
            required:true
        },
        user_profession:
        {
            type: String,
            required:true
        },
        user_annual_income:
        {
            type: String,
            required:true
        },
        show_annual_income:
        {
            type: String,
            required:true
        }
        
    }

);
const User_Educational_Details = new mongoose.model("User_Educational_Details",signschema);
module.exports = User_Educational_Details;