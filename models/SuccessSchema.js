const mongoose = require("mongoose");
const signschema = new mongoose.Schema(
    {
        partner1_name:
        {
            type: String,
            required: true
        },
        partner2_name:
        {
            type: String,
            required: true
        },
        partner1_mailid:
        {
            type: String,
            required: true
        
        },
        partner2_mailid:
        {
            type: String,
            required: true
        },
        wedding_date:
        {
            type:Date,
            required:true
        },
        About_wedding:
        {
            type: String
            
        },
        post_date:
        {
            type:Date,
            required:true
        },
        story_approval_status:
        {
            type: Number,
            required:true
        },
        success_story_photo:
        {
            type:String
        }
       
    }

);

const Success_Story = new  mongoose.model("Success_Story", signschema);
module.exports = Success_Story;
