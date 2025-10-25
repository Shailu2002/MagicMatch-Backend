
const mongoose = require("mongoose");
const signschema = new mongoose.Schema(
    {
        login_date:
        {
            type:Date,
            required: true
        },
        user_email:
        {
            type: String,
            required:true
        },
        ip_address:
        {
            type: String,
            required:true
        }
    }

);

const User_ip_Details = new mongoose.model("User_ip_Details",signschema);
module.exports = User_ip_Details;