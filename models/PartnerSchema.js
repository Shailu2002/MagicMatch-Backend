const mongoose = require("mongoose");
const signschema = new mongoose.Schema(
    {
        user_id:
        {
            type: String,
            required:true
        },
        partner_gender:
        {
            type: String,
            required:true
        },
        
        partner_min_age:
        {
            type:Number,
            required:true
        },
        partner_max_age:
        {
            type: Number,
            required:true
        },
        partner_min_height:
        {
            type: String,
            required:true
        },
        partner_max_height:
        {
            type: String,
            required:true
        },
        partner_marital_status:
        {
            type: Array,
            required:true
        },
        partner_religion:
        {
            type: Array,
            required:true
        },
        partner_diet:
        {
            type: Array,
            required:true
        },
        partner_mtongue:
        {
            type: Array,
            required:true
        },
        partner_highest_qualification:
        {
            type: Array,
            required:true
        },
        partner_working_with:
        {
            type: Array,
            required:true
        },
        partner_profession:
        {
            type:Array,
            required:true
        },
        partner_country:
        {
            type: Array,
            required:true
        },
        partner_state:
        {
            type:Array,
            required:true
        },
        partner_city:
        {
            type: Array,
            required:true
        }

    }

);
const User_Partner_Details = new mongoose.model("User_Partner_Details",signschema);
module.exports = User_Partner_Details;