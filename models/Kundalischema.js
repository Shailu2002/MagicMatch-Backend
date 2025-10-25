const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const kundaliSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        trim: true
    }, 
    user_dob: {
        type: String,
        trim:true
    },
    user_sunsign: {
        type: String,
        trim:true
        
    },
    user_kundali: {
        type: String
    },

  
});

const User_kundali = mongoose.model('User_kundali', kundaliSchema);

module.exports = User_kundali;