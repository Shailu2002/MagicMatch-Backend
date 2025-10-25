const mongoose = require("mongoose");
const Languageschema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true,
        }

    }
);
const Language= new mongoose.model("Language", Languageschema);
module.exports=Language