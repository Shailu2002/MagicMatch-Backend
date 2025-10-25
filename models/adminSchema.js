//step4 model create
//structure banayenge jiska data insert karna h
const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
    {
        name:{
            type: String
        },
        email:
        {
            type: String,
            required:true
        },
        password:
        {
            type: String,
            required:true
        },
        cpassword:
        {
            type: String,
        }
    }

);

adminSchema.pre('save', async  function(next){
    if(this.isModified('password')){
         this.password = bcrypt.hashSync(this.password,12)
         this.cpassword = bcrypt.hashSync(this.cpassword,12)
    }
    next();
})

const admins= new mongoose.model("admins", adminSchema);
module.exports=admins
