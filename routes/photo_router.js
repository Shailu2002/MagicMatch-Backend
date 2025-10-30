// const router = require('express').Router();
// const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');
// let path = require('path');
// let Userphoto = require('../models/PhotoSchema');

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'images');
//     },
//     filename: function(req, file, cb) {   
//         cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
       
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//     if(allowedFileTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }

// const maxsize = 1*1024 *1024;  //1mb

// let upload = multer({
//     storage, fileFilter, limits: {
//         fileSize:maxsize
//     }
// });


// router.route('/add').post(upload.single('user_photo'), (req, res) => {
 
//     const user_id = req.body.user_id;
//     const user_photo = "../images/"+req.file.filename;
//     console.log(user_photo);
//     const newUserData = {
//         user_id,
//         user_photo
//     }

//     const newUser = new Userphoto(newUserData);
     
//     newUser.save()
//            .then(() => res.json('User Added'))
//            .catch(err => res.status(400).json('Error: ' + err));
// });


// router.route('/add').put(upload.single('user_photo'), async(req, res) => {
 
//     const user_id = req.body.user_id;
//     const user_photo = "../images/"+req.file.filename;
//     console.log(user_photo);
//        const up=await   Userphoto.updateOne(
//         { user_id:user_id},
//         {
//           $set: {
//             user_photo:user_photo
//           },
//         },
//         {
//           new: true,
//         }
//     );
    
//     if (up)
//     {
//         res.json("photo updated");
//     }
//     else
//     {
//         res.status(400).json("error");
//         }
 
// });
  

// module.exports = router;

const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const streamifier = require("streamifier");
const Userphoto = require("../models/PhotoSchema");

//  Middleware imports
const { upload } = require("../middleware/multerConfig");
const cloudinary = require("../middleware/cloudinaryConfig");

// POST: Add new user photo
router.post("/add", upload.single("user_photo"), async (req, res) => {
  try {
    const user_id = req.body.user_id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "user_photos",
          public_id: uuidv4(),
          transformation: [{ width: 800, height: 800, crop: "limit" }], // optional
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const user_photo = result.secure_url;

    //  Save photo URL to DB
    const newUser = new Userphoto({ user_id, user_photo });
    await newUser.save();

    res.json({ message: "User photo added ", imageUrl: user_photo });
  } catch (err) {
    console.error("Error adding photo:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

//  PUT: Update existing user photo
router.put("/add", upload.single("user_photo"), async (req, res) => {
  try {
    const user_id = req.body.user_id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    //Upload updated photo to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "user_photos",
          public_id: uuidv4(),
          transformation: [{ width: 800, height: 800, crop: "limit" }],
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const user_photo = result.secure_url;

    //  Update DB entry
    const updated = await Userphoto.updateOne(
      { user_id },
      { $set: { user_photo } },
      { new: true }
    );

    if (updated.modifiedCount > 0) {
      res.json({ message: "Photo updated", imageUrl: user_photo });
    } else {
      res.status(404).json({ error: "User not found or no change made" });
    }
  } catch (err) {
    console.error("Error updating photo:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;



    
