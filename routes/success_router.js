const router = require('express').Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
let Success_Story = require("../models/SuccessSchema");
const User_Password = require("../models/SignUpSchema");
const Personal = require("../models/PersonaSchema");
const e = require('express');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'succes_photo');
        console.log(uuidv4());
    },
    filename: function (req, file, cb) {   
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

const maxsize = 1* 1024 * 1024;

let upload = multer({
    storage, fileFilter, limits: {
        fileSize:maxsize
    }
});

router.route('/add').post(upload.single('success_story_photo'), async (req, res) => {
    const partner1_name = req.body.partner1_name;
    const partner2_name = req.body.partner2_name;
    const partner1_mailid = req.body.partner1_mailid;
    const partner2_mailid = req.body.partner2_mailid;
    const wedding_date = req.body.wedding_date;
    const About_wedding = req.body.About_wedding;
    const post_date = req.body.post_date;
    const story_approval_status = req.body.story_approval_status;
    const success_story_photo ="../succes_photo/"+ (req.file.filename);
    console.log(success_story_photo);
    const newUserData = {
        partner1_name,
        partner2_name,
        partner1_mailid,
        partner2_mailid,
        wedding_date,
        About_wedding,
        post_date,
        story_approval_status,
        success_story_photo
    }
    const precheck1 = await User_Password.findOne({ user_email: partner1_mailid });
    const precheck2 = await User_Password.findOne({ user_email: partner2_mailid });
    const existsuccess1 = await Success_Story.findOne({ partner1_mailid: partner1_mailid, partner2_mailid: partner2_mailid });
    const existsuccess2 = await Success_Story.findOne({ partner1_mailid: partner2_mailid, partner2_mailid: partner1_mailid });
    if (existsuccess1 || existsuccess2)
    {
        res.status(408).json("already done");
    }
    if ((precheck1 && precheck2) && (!existsuccess1 && !existsuccess2))
    {
        const user_id1 = precheck1.user_id;
        const user_id2 = precheck2.user_id;
        const namecheck1 = await Personal.findOne({ user_id: user_id1, user_name: partner1_name });
        const namecheck2 = await Personal.findOne({ user_id: user_id2, user_name: partner2_name });
        if (namecheck1 && namecheck2)
        {
            console.log(newUserData);
            const newUser = new Success_Story(newUserData);
            newUser.save()
            .then(() => res.json('User Added'))
            .catch(err => res.status(400).json('Error: ' + err));   
            
        }
        else
        {
            res.status(301).json("invalid name");
            }
 
    }
    else if (!precheck1 && precheck2)
    {
        res.status(401).json("your mail id is not registered");
    }
    else if (precheck1 && !precheck2)
    {
        res.status(402).json("Partner's mail id is not registered");
    }
    else
    {
        res.status(403).json("Both mail id's are not registered");
    }
    
});

module.exports = router;