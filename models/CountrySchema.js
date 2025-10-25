const mongoose = require("mongoose");
const countryschema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true,
        },
        isCode:
        {
            type: String,
            required:true
        },

    }
);
const Country= new mongoose.model("Country", countryschema);
module.exports=Country