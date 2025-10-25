//step 4 table banana database me 
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const signschema = new mongoose.Schema(
    {
        user_id:
        {
            type: String,
            required:true
        },
        user_date:
        {
            type:Date,
            required:true
        },
        user_email:
        {
            type: String,
            required:true
        },
        user_contact:
        {
            type: String,
            required:true
        },
        user_pass:
        {
            type: String,
            required:true
        },
        user_cpass:
        {
            type: String,
            required:true
        },
        activeStatus:
        {
            type: Boolean,
            required:true
        },
        tokens: [
            {
                token: {
                    type: String,
                }
            }
        ]
        
    }

);
//we are hashing

signschema.pre('save', async  function (next) {
    if (this.isModified('user_pass')) {
        this.user_pass = bcrypt.hashSync(this.user_pass, 12);
        this.user_cpass = bcrypt.hashSync(this.user_cpass, 12); 
    }
    next();
})

//we are generating token

signschema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    }
    catch (err)
    {
        console.log(err);
    }
}

const User_Password = new mongoose.model("User_Password",signschema);
module.exports = User_Password;