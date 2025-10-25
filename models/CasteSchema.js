const mongoose = require("mongoose");
const Casteschema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true,
        },
        religion:{
            type:String,
            required:true,
        }
    }
);
const Caste= new mongoose.model("Caste", Casteschema);
module.exports=Caste