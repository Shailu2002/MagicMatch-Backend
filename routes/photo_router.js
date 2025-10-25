const router = require('express').Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
let Userphoto = require('../models/PhotoSchema');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
       
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const maxsize = 1*1024 *1024;  //1mb

let upload = multer({
    storage, fileFilter, limits: {
        fileSize:maxsize
    }
});


router.route('/add').post(upload.single('user_photo'), (req, res) => {
 
    const user_id = req.body.user_id;
    const user_photo = "../images/"+req.file.filename;
    console.log(user_photo);
    const newUserData = {
        user_id,
        user_photo
    }

    const newUser = new Userphoto(newUserData);
     
    newUser.save()
           .then(() => res.json('User Added'))
           .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/add').put(upload.single('user_photo'), async(req, res) => {
 
    const user_id = req.body.user_id;
    const user_photo = "../images/"+req.file.filename;
    console.log(user_photo);
       const up=await   Userphoto.updateOne(
        { user_id:user_id},
        {
          $set: {
            user_photo:user_photo
          },
        },
        {
          new: true,
        }
    );
    
    if (up)
    {
        res.json("photo updated");
    }
    else
    {
        res.status(400).json("error");
        }
 
});
  

module.exports = router;

