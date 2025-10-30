// const router = require('express').Router();
// const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');
// let path = require('path');
// let Success_Story = require("../models/SuccessSchema");
// const User_Password = require("../models/SignUpSchema");
// const Personal = require("../models/PersonaSchema");
// const e = require('express');


// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'succes_photo');
//         console.log(uuidv4());
//     },
//     filename: function (req, file, cb) {
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

// const maxsize = 1* 1024 * 1024;

// let upload = multer({
//     storage, fileFilter, limits: {
//         fileSize:maxsize
//     }
// });

// router.route('/add').post(upload.single('success_story_photo'), async (req, res) => {
//     const partner1_name = req.body.partner1_name;
//     const partner2_name = req.body.partner2_name;
//     const partner1_mailid = req.body.partner1_mailid;
//     const partner2_mailid = req.body.partner2_mailid;
//     const wedding_date = req.body.wedding_date;
//     const About_wedding = req.body.About_wedding;
//     const post_date = req.body.post_date;
//     const story_approval_status = req.body.story_approval_status;
//     const success_story_photo ="../succes_photo/"+ (req.file.filename);
//     console.log(success_story_photo);
//     const newUserData = {
//         partner1_name,
//         partner2_name,
//         partner1_mailid,
//         partner2_mailid,
//         wedding_date,
//         About_wedding,
//         post_date,
//         story_approval_status,
//         success_story_photo
//     }
//     const precheck1 = await User_Password.findOne({ user_email: partner1_mailid });
//     const precheck2 = await User_Password.findOne({ user_email: partner2_mailid });
//     const existsuccess1 = await Success_Story.findOne({ partner1_mailid: partner1_mailid, partner2_mailid: partner2_mailid });
//     const existsuccess2 = await Success_Story.findOne({ partner1_mailid: partner2_mailid, partner2_mailid: partner1_mailid });
//     if (existsuccess1 || existsuccess2)
//     {
//         res.status(408).json("already done");
//     }
//     if ((precheck1 && precheck2) && (!existsuccess1 && !existsuccess2))
//     {
//         const user_id1 = precheck1.user_id;
//         const user_id2 = precheck2.user_id;
//         const namecheck1 = await Personal.findOne({ user_id: user_id1, user_name: partner1_name });
//         const namecheck2 = await Personal.findOne({ user_id: user_id2, user_name: partner2_name });
//         if (namecheck1 && namecheck2)
//         {
//             console.log(newUserData);
//             const newUser = new Success_Story(newUserData);
//             newUser.save()
//             .then(() => res.json('User Added'))
//             .catch(err => res.status(400).json('Error: ' + err));
            
//         }
//         else
//         {
//             res.status(301).json("invalid name");
//             }
 
//     }
//     else if (!precheck1 && precheck2)
//     {
//         res.status(401).json("your mail id is not registered");
//     }
//     else if (precheck1 && !precheck2)
//     {
//         res.status(402).json("Partner's mail id is not registered");
//     }
//     else
//     {
//         res.status(403).json("Both mail id's are not registered");
//     }
    
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const streamifier = require("streamifier");

const Success_Story = require("../models/SuccessSchema");
const User_Password = require("../models/SignUpSchema");
const Personal = require("../models/PersonaSchema");

//  Import middleware configs
const { upload } = require("../middleware/multerConfig");
const cloudinary = require("../middleware/cloudinary");

// POST: Add Success Story
router.post("/add", upload.single("success_story_photo"), async (req, res) => {
  try {
    const {
      partner1_name,
      partner2_name,
      partner1_mailid,
      partner2_mailid,
      wedding_date,
      About_wedding,
      post_date,
      story_approval_status,
    } = req.body;

    //  Check if file uploaded
    if (!req.file) return res.status(400).json("No file uploaded");

    //  Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "success_stories",
          public_id: uuidv4(),
          transformation: [{ width: 1000, height: 1000, crop: "limit" }],
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const success_story_photo = result.secure_url;

    // Validation checks
    const precheck1 = await User_Password.findOne({
      user_email: partner1_mailid,
    });
    const precheck2 = await User_Password.findOne({
      user_email: partner2_mailid,
    });

    const existsuccess1 = await Success_Story.findOne({
      partner1_mailid,
      partner2_mailid,
    });
    const existsuccess2 = await Success_Story.findOne({
      partner1_mailid: partner2_mailid,
      partner2_mailid: partner1_mailid,
    });

    if (existsuccess1 || existsuccess2) {
      return res.status(408).json("Already exists");
    }

    if (precheck1 && precheck2 && !existsuccess1 && !existsuccess2) {
      const user_id1 = precheck1.user_id;
      const user_id2 = precheck2.user_id;

      const namecheck1 = await Personal.findOne({
        user_id: user_id1,
        user_name: partner1_name,
      });
      const namecheck2 = await Personal.findOne({
        user_id: user_id2,
        user_name: partner2_name,
      });

      if (namecheck1 && namecheck2) {
        const newStory = new Success_Story({
          partner1_name,
          partner2_name,
          partner1_mailid,
          partner2_mailid,
          wedding_date,
          About_wedding,
          post_date,
          story_approval_status,
          success_story_photo, //  Cloudinary URL
        });

        await newStory.save();
        return res.json({
          message: "Success story added",
          imageUrl: success_story_photo,
        });
      } else {
        return res.status(301).json("Invalid name");
      }
    } else if (!precheck1 && precheck2) {
      return res.status(401).json("Your mail ID is not registered");
    } else if (precheck1 && !precheck2) {
      return res.status(402).json("Partner's mail ID is not registered");
    } else {
      return res.status(403).json("Both mail IDs are not registered");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("Internal server error");
  }
});

module.exports = router;


  
