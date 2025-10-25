const mongoose = require("mongoose");
const Religionschema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true,
        }

    }
);
const Religion= new mongoose.model("Religion", Religionschema);
module.exports=Religion