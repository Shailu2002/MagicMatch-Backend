const mongoose = require("mongoose");
const cityschema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true,
        },
        statecode:
        {
            type: String,
            required:true
        },
        countrycode:{
            type:String,
            required:true,
        }

    }
);
const City= new mongoose.model("City", cityschema);
module.exports = City;