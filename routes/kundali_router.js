const router = require('express').Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
let KundaliSchema = require("../models/Kundalischema");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(null, 'kundali');
     
    },
    filename: function (req, file, cb) {   
    
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
       
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['application/pdf'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage});

router.route('/add').post(upload.single('user_kundali'), (req, res) => {
 
    const user_id = req.body.user_id;
    const user_dob = req.body.user_dob;
    const user_sunsign = req.body.user_sunsign;
    const user_kundali = "../kundali/" + (req.file.filename);
    console.log(user_kundali);
    const newUserData = {
        user_id,
        user_dob,
        user_sunsign,
        user_kundali
    }

    const newUser = new KundaliSchema(newUserData);
     
    newUser.save()
           .then(() => res.json('kundali uploaded'))
           .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;