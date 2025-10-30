const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const admins = require("../models/adminSchema");
const User_Password = require("../models/SignUpSchema");
const User_Payment = require("../models/PaymentSchema");
const User_General_Details = require("../models/GeneralSchema");
const User_Educational_Details = require("../models/EducationSchema");
const User_Personal_Details = require("../models/PersonaSchema");
const User_Partner_Details = require("../models/PartnerSchema");
const Success_Story = require("../models/SuccessSchema");
const User_photo = require("../models/PhotoSchema");
const User_Feedback = require("../models/FeedbackSchema");
const Ipschema = require("../models/Ipschems");
const ForgotPass = require("../models/Forgotpass");
const Interest = require("../models/Interest_schema");
const Plan = require("../models/Plam");
const Country = require("../models/CountrySchema");
const State = require("../models/StateSchema");
const City = require("../models/CitySchema");
const Religion = require("../models/ReligionSchema");
const Caste = require("../models/CasteSchema");
const Language = require("../models/LanguageSchema");

router.get("/logout", async (req, res) => {
  try {
    console.log("logout Successfully!");
    res.clearCookie("jwtoken",{path:"/"});
    res.status(200).json("user logout");
 
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get("/getalldata", async (req, res) => {
  try {
    const success = await Success_Story.find({ story_approval_status: 1 });
    console.log(success);
    res.status(200).json(success);
  } catch (error) {
    res.status(404).json(error);
  }
});

//get membership plans

router.get("/getallplans", async (req, res) => {
  try {
    const success = await Plan.find({ enable: 1 });
    console.log(success);
    res.status(200).json(success);
  } catch (error) {
    res.status(404).json(error);
  }
});

//update interest

router.patch("/update_interest/:e1/:uind",async (req, res) => {
  try {
    const { e1,uind } = req.params;
    const { statust,message_reply,reply_date } = req.body;
    const updateuser = await Interest.updateOne(
      { user_id:e1,to_uid:uind },
      {
        $set: {
          sent_invitation_status: statust,
          message_reply: message_reply,
          reply_date:reply_date
        },
      },
      {
        new: true,
      }
    );
    console.log(updateuser);
    console.log("updated");
    res.status(200).json(updateuser);
  } catch (error) {
    console.log("error");
    res.status(400).json(error);
  }
});
// to get all the interest received
router.get("/getinterest_details/:uind",async (req,res) =>
{

  let arr = [];
  const { uind } = req.params;
  console.log(uind);
  try
  {
    const data = await Interest.find({ user_id: uind });
    console.log(data);
    for (let i = 0; i < data.length;i++)
    {
      arr.push(data[i].to_uid);
    }
    console.log(arr);
    const getdata = await User_Personal_Details.aggregate([
      {
        $lookup: {
          from: "user_general_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "general",
        },
      },
      {
        $lookup: {
          from: "user_educational_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "educational",
        },
      },
      {
        $lookup: {
          from: "user_photos",
          localField: "user_id",
          foreignField: "user_id",
          as: "photos",
        },
      },
      {
        $match: { user_id: {$in:arr}},
      }
    ]);
    console.log(getdata);
    res.status(200).json(getdata);
  }
  catch (error)
  {
    res.status(404).json(error);
  }
});
   
  // to get all the interest received
router.get("/getinterest/:uind", async (req,res) =>
{
  const { uind } = req.params;
  console.log(uind);
  try
  {
    const data = await Interest.find({ user_id: uind });
    console.log(data);
    res.status(200).json(data);
  }
  catch (error)
  {
    res.status(404).json(error);
  }
});

router.get("/getreceived_details/:uind", async (req,res) =>
{

  let arr = [];
  const { uind } = req.params;
  console.log(uind);
  try
  {
    const data = await Interest.find({ to_uid: uind });
    console.log(data);
    for (let i = 0; i < data.length;i++)
    {
      arr.push(data[i].user_id);
    }
    console.log(arr);
    const getdata = await User_Personal_Details.aggregate([
      {
        $lookup: {
          from: "user_general_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "general",
        },
      },
      {
        $lookup: {
          from: "user_educational_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "educational",
        },
      },
      {
        $lookup: {
          from: "user_photos",
          localField: "user_id",
          foreignField: "user_id",
          as: "photos",
        },
      },
      {
        $lookup: {
          from: "user_passwords",
          localField: "user_id",
          foreignField: "user_id",
          as: "contact",
        },
      },
      {
        $match: { user_id: {$in:arr}},
      }
    ]);
    console.log(getdata);
    res.status(200).json(getdata);
  }
  catch (error)
  {
    res.status(404).json(error);
  }
});
   
  // to get all the interest received
router.get("/getreceived/:uind",async (req,res) =>
{
  const { uind } = req.params;
  console.log(uind);
  try
  {
    const data = await Interest.find({ to_uid: uind });
    console.log(data);
    res.status(200).json(data);
  }
  catch (error)
  {
    res.status(404).json(error);
  }
});


//this will check whether that email is present or not
router.post("/check_emailotp", async (req, res) => {
  const { user_email } = req.body;
  try {
    console.log(req.body);
    const preuser = await User_Password.findOne({ user_email: user_email });
    if (preuser) {
      console.log(preuser);
      res.status(200).json(preuser);
    } else {
      res.status(400).json("not registered");
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

//this will check registered if already then it will not be inserted
router.post("/user_signup1", async (req, res) => {
  const {
    user_id,
    user_date,
    user_email,
    user_contact,
    user_pass,
    user_cpass,
    activeStatus
  } = req.body;
  try {
    console.log(req.body);
    const preuser = await User_Password.findOne({ user_email: user_email });
    if (preuser) {
      console.log(preuser);
      res.status(400).json("You are Already Registered");
    } else {
      const adduser = new User_Password({
        user_id,
        user_date,
        user_email,
        user_contact,
        user_pass,
        user_cpass,
        activeStatus
      });
     //here we have to hash encrypt paassword
      
      await adduser.save();
      console.log(adduser);
      res.status(200).json(adduser);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

// for interest sent
router.post("/interest_sent", async (req, res) => {
  const { user_id, to_uid, message_sent, sent_date, sent_invitation_status,message_reply,reply_date } = req.body;
  console.log(req.body);
  try
  {
    const presend = await Interest.findOne({ user_id: user_id, to_uid: to_uid });
  if(presend)
    {
    res.status(203).json("already sent");
    }
    else
    {
      const adduser = new Interest({
        user_id, to_uid, message_sent, sent_date, sent_invitation_status, message_reply, reply_date
      })
      await adduser.save();
      res.status(200).json(adduser);
    }
    }
   catch (error) {
    res.status(404).json(error);
  }
});


//for login
router.post("/check_user_login", async (req, res) => {
  const { user_email, user_password ,ip_address, login_date} = req.body;
  try {
    let token;
    const usert = await User_Password.findOne({ user_email: user_email });
    console.log(req.body, usert);
    if (usert)
    {

  
      //yaha par pehle jo password user ne enter kiya h vo likho then original hashed password
      const isMatch = bcrypt.compareSync(user_password, usert.user_pass);
      console.log(usert.user_pass, user_password);
      console.log(isMatch);
      if (isMatch)
      {

         token = await usert.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly:true
        });
        res.status(200).json(usert);
        const ifexist = await Ipschema.findOne({ user_email: user_email })
        if (ifexist)
        {
          const updateuser = await Ipschema.updateOne(
            {user_email:user_email},
            {
              $set: {
                login_date: login_date,
                ip_address:ip_address
              },
            },
            {
              new: true,
            }
          );
          
        }
        else
        {
          const adduser = new Ipschema({
            login_date,user_email,ip_address
         });
          await adduser.save();
          
        }
        
      } else {
        res.status(201).json("incorrect password");
      }
    }
    else {
      res.status(401).json("Email id is not registered");
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/user_payment1", async (req, res) => {
  const {
    user_id,
    transaction_id,
    total_amount,
    plan_name,
    plan_duration,
    approval_status,
    active_status,
    payment_date,
    amount_received,
    user_email_id,
  } = req.body;
  console.log(req.body);
  try {
    const adduser = await new User_Payment({
      user_id,
      transaction_id,
      total_amount,
      plan_name,
      plan_duration,
      approval_status,
      active_status,
      payment_date,
      amount_received,
      user_email_id,
    });

    await adduser.save();
    res.status(200).json(adduser);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/user_general", async (req, res) => {
  const {
    user_id,
    user_height,
    user_blood_group,
    user_body_type,
    user_complexion,
    user_diet,
    user_hobbies,
  } = req.body;
  console.log(req.body);
  try {
    const adduser = await new User_General_Details({
      user_id,
      user_height,
      user_blood_group,
      user_body_type,
      user_complexion,
      user_diet,
      user_hobbies,
    });

    await adduser.save();
    res.status(200).json(adduser);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/user_education", async (req, res) => {
  const {
    user_id,
    user_highest_qualification,
    user_working_with,
    user_profession,
    user_annual_income,
    show_annual_income,
  } = req.body;
  console.log(req.body);
  try {
    const adduser = await new User_Educational_Details({
      user_id,
      user_highest_qualification,
      user_working_with,
      user_profession,
      user_annual_income,
      show_annual_income,
    });

    await adduser.save();
    res.status(200).json(adduser);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/user_personal", async (req, res) => {
  const {
    user_id,
    user_name,
    user_age,
    user_gender,
    user_religion,
    user_caste,
    user_marital,
    user_mtongue,
    user_about_yourself,
    user_premium_status,
    user_no_of_invitation_sent,
    user_no_of_invitation_received,
    user_country,
    user_state,
    user_city
  } = req.body;
  console.log(req.body);
  try {
    const adduser = await new User_Personal_Details({
      user_id,
      user_name,
      user_age,
      user_gender,
      user_religion,
      user_caste,
      user_marital,
      user_mtongue,
      user_about_yourself,
      user_premium_status,
      user_no_of_invitation_sent,
      user_no_of_invitation_received,
      user_country,
      user_state,
      user_city
    });

    await adduser.save();
    res.status(200).json(adduser);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/user_partner", async (req, res) => {
  const {
    user_id,
    partner_gender,
    partner_min_age,
    partner_max_age,
    partner_min_height,
    partner_max_height,
    partner_marital_status,
    partner_religion,
    partner_diet,
    partner_mtongue,
    partner_highest_qualification,
    partner_working_with,
    partner_profession,
    partner_country,
    partner_state,
    partner_city,
  } = req.body;
  console.log(req.body);
  try {
    const adduser = await new User_Partner_Details({
      user_id,
      partner_gender,
      partner_min_age,
      partner_max_age,
      partner_min_height,
      partner_max_height,
      partner_marital_status,
      partner_religion,
      partner_diet,
      partner_mtongue,
      partner_highest_qualification,
      partner_working_with,
      partner_profession,
      partner_country,
      partner_state,
      partner_city,
    });

    await adduser.save();
    res.status(200).json(adduser);
  } catch (error) {
    res.status(404).json(error);
  }
});




//for newuser
router.post("/nsignup", async (req, res) => {
  const { user_name, user_id, user_pass, user_email, status, date } = req.body;
  try {
    console.log(req.body);
    const preuser = await Nusers.findOne({ user_email: user_email });
    if (preuser) {
      console.log(preuser);
      res.status(404).json("This user already registered");
    } else {
      const adduser = new Nusers({
        user_name,
        user_id,
        user_pass,
        user_email,
        status,
        date,
      });
      console.log(user_name);
      await adduser.save();
      res.status(201).json(adduser);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

//get personal details

router.get("/getpersonaldata_user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const data = await User_Personal_Details.findOne({ user_id: uid });
    console.log(data);

    if (data) {
      console.log(data);
      res.status(200).json(data);
    } else {
      res.status(201).json("data not found");
    }
  } catch (error) {
    res.status(404).json("error");
  }
});

// get general details
router.get("/getgeneraldata/:uid", async (req, res) => {
  try{
    const { uid } = req.params;

    const data = await User_General_Details.findOne({ user_id: uid });
    console.log(data);

    if (data) {
      console.log(data);
      res.status(200).json(data);
    } else {
      res.status(201).json("data not found");
    }
  } catch (error) {
    res.status(404).json("error");
  }
});
//get partner details

router.get("/getpartnerdata/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const data = await User_Partner_Details.findOne({ user_id: uid });
    console.log(data);

    if (data) {
      console.log(data);
      res.status(200).json(data);
    } else {
      res.status(201).json("data not found");
    }
  } catch (error) {
    res.status(404).json("error");
  }
});

//get educational details

router.get("/geteducationaldata/:uid",async (req, res) => {
  try {
    const { uid } = req.params;

    const data = await User_Educational_Details.findOne({ user_id: uid });
    console.log(data);

    if (data) {
      console.log(data);
      res.status(200).json(data);
    } else {
      res.status(201).json("data not found");
    }
  } catch (error) {
    res.status(404).json("error");
  }
});


// function to hash password while reset password
const securePassword = async (password) =>
{
  try
  {
    const passhass =  bcrypt.hashSync(password, 12);
    return passhass;
  }
  catch (error)
  {
    console.log(error);
  }
}
  
router.patch("/update_pass_user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { user_pass, user_cpass } = req.body;
    const user_passHash = await securePassword(user_pass);
    const user_cpassHash = await securePassword(user_cpass);
    const updateuser = await User_Password.findByIdAndUpdate(
      id,
      {
        $set: {
          user_pass: user_passHash,
          user_cpass: user_cpassHash,
        },
      },
      {
        new: true,
      }
    );
    console.log("updated");
    res.status(201).json(updateuser);
  } catch (error) {
    console.log("error");
    res.status(422).json(error);
  }
});

//update personal details

router.patch("/update_personal/:aid", async (req, res) => {
  try {
    const { aid } = req.params;
    console.log(aid);
    const {
      user_age,
      user_religion,
      user_caste,
      user_marital,
      user_mtongue,
      user_about_yourself,
      user_country,
      user_state,
      user_city,
    } = req.body;
    const updateuser = await User_Personal_Details.findByIdAndUpdate(
      aid,
      {
        $set: {
          user_age: user_age,
          user_religion: user_religion,
          user_caste: user_caste,
          user_city: user_city,
          user_state: user_state,
          user_country: user_country,
          user_about_yourself: user_about_yourself,
          user_marital: user_marital,
          user_mtongue: user_mtongue,
        },
      },
      {
        new: true,
      }
    );

    console.log(updateuser);
    console.log("updated");
    res.status(201).json(updateuser);
  } catch (error) {
    console.log("error");
    res.status(422).json(error);
  }
});

//update general details

router.patch("/update_general/:uid",async (req, res) => {
  try {
    const { uid } = req.params;
    console.log(uid);
    console.log(req.body);
    const {
      user_height,
      user_blood_group,
      user_body_type,
      user_complexion,
      user_diet,
      user_hobbies,
    } = req.body;
    const updateuser = await User_General_Details.updateOne(
      { user_id: uid },
      {
        $set: {
          user_height: user_height,
          user_blood_group: user_blood_group,
          user_body_type: user_body_type,
          user_complexion: user_complexion,
          user_diet: user_diet,
          user_hobbies: user_hobbies,
        },
      },
      {
        new: true,
      }
    );

    console.log(updateuser);
    console.log("updated");
    res.status(200).json(updateuser);
  } catch (error) {
    console.log("error");
    res.status(400).json(error);
  }
});

//update educational details

router.patch("/update_educational/:uid",async (req, res) => {
  try {
    const { uid } = req.params;
    console.log(uid);
    console.log(req.body);
    const {
      user_highest_qualification,
      user_working_with,
      user_profession,
      user_annual_income,
      show_annual_income,
    } = req.body;
    const updateuser = await User_Educational_Details.updateOne(
      { user_id: uid },
      {
        $set: {
          user_highest_qualification: user_highest_qualification,
          user_working_with: user_working_with,
          user_profession: user_profession,
          user_annual_income: user_annual_income,
          show_annual_income: show_annual_income,
        },
      },
      {
        new: true,
      }
    );

    console.log(updateuser);
    console.log("updated");
    res.status(200).json(updateuser);
  } catch (error) {
    console.log("error");
    res.status(400).json(error);
  }
});

//update partner details
router.patch("/update_partner/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    console.log(uid);
    console.log(req.body);
    const {
      partner_min_age,
      partner_max_age,
      partner_min_height,
      partner_max_height,
      partner_marital_status,
      partner_religion,
      partner_diet,
      partner_mtongue,
      partner_highest_qualification,
      partner_working_with,
      partner_profession,
      partner_country,
      partner_state,
      partner_city,
    } = req.body;
    const updateuser = await User_Partner_Details.updateOne(
      { user_id: uid },
      {
        $set: {
          partner_min_age: partner_min_age,
          partner_max_age: partner_max_age,
          partner_min_height: partner_min_height,
          partner_max_height: partner_max_height,
          partner_marital_status: partner_marital_status,
          partner_religion: partner_religion,
          partner_diet: partner_diet,
          partner_mtongue: partner_mtongue,
          partner_highest_qualification: partner_highest_qualification,
          partner_working_with: partner_working_with,
          partner_profession: partner_profession,
          partner_country: partner_country,
          partner_state: partner_state,
          partner_city: partner_city,
        },
      },
      {
        new: true,
      }
    );

    console.log(updateuser);
    console.log("updated");
    res.status(200).json(updateuser);
  } catch (error) {
    console.log("error");
    res.status(400).json(error);
  }
});

//joing two tables photo and personal details

router.get("/gethomedata/:uind", async (req, res) => {
  try {
    const { uind } = req.params;
    const getdata = await User_Personal_Details.aggregate([
      {
        $lookup: {
          from: "user_photos",
          localField: "user_id",
          foreignField: "user_id",
          as: "Details",
        },
      },
      {
        $lookup: {
          from: "user_payments",
          localField: "user_id",
          foreignField: "user_id",
          as: "Payment",
        },
      },
      {
        $lookup: {
          from: "user_interests",
          localField: "user_id",
          foreignField: "user_id",
          as: "Interest",
        },
      },
      {
        $lookup: {
          from: "user_interests",
          localField: "user_id",
          foreignField: "to_uid",
          as: "Express",
        },
      },
      {
        $match: { user_id: uind },
      },
      {
        $project: {
          user_name: 1,
          Details: 1,
          user_premium_status: 1,
          user_id: 1,
          user_no_of_invitation_sent: 1,
          user_no_of_invitation_received: 1,
          user_gender: 1,
          Payment: 1,
          Interest: 1,
          Express:1,
        },
      },
    ]);
    if (getdata) {
      console.log(getdata);
      res.status(200).json(getdata);
    } else if (!getdata) {
      res.status(201).json("not found");
    }
  } catch (error) {
    res.status(404).json("error");
  }
});

//joing all tables photo and personal details

router.get("/getalldetails_data/:uind", async (req, res) => {
  try {
    const { uind } = req.params;
    const getdata = await User_Personal_Details.aggregate([
      {
        $lookup: {
          from: "user_general_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "general",
        },
      },
      {
        $lookup: {
          from: "user_educational_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "educational",
        },
      },

      {
        $lookup: {
          from: "user_partner_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "partner",
        },
      },
      {
        $lookup: {
          from: "user_passwords",
          localField: "user_id",
          foreignField: "user_id",
          as: "contact",
        },
      },
      {
        $lookup: {
          from: "user_kundalis",
          localField: "user_id",
          foreignField: "user_id",
          as: "kundalis",
        },
      },
      {
        $lookup: {
          from: "user_photos",
          localField: "user_id",
          foreignField: "user_id",
          as: "photos",
        },
      },
      {
        $lookup: {
          from: "user_payments",
          localField: "user_id",
          foreignField: "user_id",
          as: "Payment",
        },
      },
      {
        $match: { user_id: uind },
      },
      {
        $sort:{ user_date: 1 }
      }
    ]);
    if (getdata) {
      console.log(getdata);
      res.status(200).json(getdata);
    } else if (!getdata) {
      res.status(201).json("not found");
    }
  } catch (error) {
    res.status(404).json("error");
  }
});


//for feedback

router.post("/user_feedback", async (req, res) => {
  const { user_name, user_email, user_feedback, user_ratings } = req.body;
  try {
    console.log(req.body);
    const preuser = await User_Password.findOne({ user_email: user_email });
    if (!preuser) {
      res.status(201).json("Your email id  is  not registered ");
    } else {
      
      const user_id = preuser.user_id;
      const preuser2 = await User_Personal_Details.findOne({user_id:user_id,user_name:user_name});
      if (preuser2) {
       
        const adduser = new User_Feedback({
          user_name,
          user_email,
          user_feedback,
          user_ratings,
        });
        await adduser.save();
        res.status(200).json(adduser);
      }
      else
      {
        res.status(202).json("name is invalid");
        }
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

//search by id

router.get("/searchID/:ID/:gender", async (req, res) => {
  try {
    const { ID, gender } = req.params;
    console.log(ID, gender);
    const query = {
      user_gender: gender,
      user_id: { $regex: ID, $options: "i" },
    };

    const getdata = await User_Personal_Details.aggregate([
      {
        $lookup: {
          from: "user_photos",
          localField: "user_id",
          foreignField: "user_id",
          as: "Details",
        },
      },
      {
        $lookup: {
          from: "user_general_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "general",
        },
      },
      {
        $lookup: {
          from: "user_educational_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "educational",
        },
      },
      {
        $lookup: {
          from: "user_partner_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "partner",
        },
      },
      {
        $lookup: {
          from: "user_passwords",
          localField: "user_id",
          foreignField: "user_id",
          as: "contact",
        },
      },
      {
        $lookup: {
          from: "user_kundalis",
          localField: "user_id",
          foreignField: "user_id",
          as: "kundalis",
        },
      },
      {
        $lookup: {
          from: "user_payments",
          localField: "user_id",
          foreignField: "user_id",
          as: "Payment",
        },
      },
      {
        $match: query,
      },
      {
        $sort: { user_id: 1 },
      },
    ]);
    if (getdata) {
      console.log(getdata);
      res.status(200).json(getdata);
    } else if (!getdata) {
      res.status(201).json("not found");
    }
  } catch (error) {
    res.status(404).json("error");
  }
});

//search by age
router.get("/searchage/:Age/:gender", async (req, res) => {
  try {
  
    const { Age, gender } = req.params;
    console.log( Age, gender);
    const query = {
      user_gender: gender,
      user_age:Number(Age)
    };

    const getdata = await User_Personal_Details.aggregate([
      {
        $lookup: {
          from: "user_photos",
          localField: "user_id",
          foreignField: "user_id",
          as: "Details",
        },
      },
      {
        $lookup: {
          from: "user_general_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "general",
        },
      },
      {
        $lookup: {
          from: "user_educational_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "educational",
        },
      },
      {
        $lookup: {
          from: "user_partner_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "partner",
        },
      },
      {
        $lookup: {
          from: "user_passwords",
          localField: "user_id",
          foreignField: "user_id",
          as: "contact",
        },
      },
      {
        $lookup: {
          from: "user_kundalis",
          localField: "user_id",
          foreignField: "user_id",
          as: "kundalis",
        },
      },
      {
        $lookup: {
          from: "user_payments",
          localField: "user_id",
          foreignField: "user_id",
          as: "Payment",
        },
      },

      {
        $match: query,
      },
      {
        $sort: { user_id: 1 },
      },
    ]);

    if (getdata) {
      console.log(getdata);
      res.status(200).json(getdata);
    } else if (!getdata) {
      res.status(201).json("not found");
    }
  } catch (error) {
    res.status(404).json("error");
  }
});

//search by religion
router.get("/searchRel/:Religion/:gender",async (req, res) => {
  try {
    const { Religion, gender } = req.params;
    console.log(Religion, gender);
    const query = {
      user_gender: gender,
      user_religion: { $regex: Religion, $options: "i" },
    };

    const getdata = await User_Personal_Details.aggregate([
      {
        $lookup: {
          from: "user_photos",
          localField: "user_id",
          foreignField: "user_id",
          as: "Details",
        },
      },
      {
        $lookup: {
          from: "user_general_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "general",
        },
      },
      {
        $lookup: {
          from: "user_educational_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "educational",
        },
      },
      {
        $lookup: {
          from: "user_partner_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "partner",
        },
      },
      {
        $lookup: {
          from: "user_passwords",
          localField: "user_id",
          foreignField: "user_id",
          as: "contact",
        },
      },
      {
        $lookup: {
          from: "user_kundalis",
          localField: "user_id",
          foreignField: "user_id",
          as: "kundalis",
        },
      },
      {
        $lookup: {
          from: "user_payments",
          localField: "user_id",
          foreignField: "user_id",
          as: "Payment",
        },
      },

      {
        $match: query,
      },
      {
        $sort: { user_id: 1 },
      },
    ]);
    if (getdata) {
      console.log(getdata);
      res.status(200).json(getdata);
    } else if (!getdata) {
      res.status(201).json("not found");
    }
  } catch (error) {
    res.status(404).json("error");
  }
});
//search by mother tongue

router.get("/searchMton/:Mtongue/:gender",async (req, res) => {
  try {
    const { Mtongue, gender } = req.params;
    console.log(Mtongue, gender);
    const query = {
      user_gender: gender,
      user_mtongue: { $regex: Mtongue, $options: "i" },
    };

    const getdata = await User_Personal_Details.aggregate([
      {
        $lookup: {
          from: "user_photos",
          localField: "user_id",
          foreignField: "user_id",
          as: "Details",
        },
      },
      {
        $lookup: {
          from: "user_general_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "general",
        },
      },
      {
        $lookup: {
          from: "user_educational_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "educational",
        },
      },
      {
        $lookup: {
          from: "user_partner_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "partner",
        },
      },
      {
        $lookup: {
          from: "user_passwords",
          localField: "user_id",
          foreignField: "user_id",
          as: "contact",
        },
      },
      {
        $lookup: {
          from: "user_kundalis",
          localField: "user_id",
          foreignField: "user_id",
          as: "kundalis",
        },
      },
      {
        $lookup: {
          from: "user_payments",
          localField: "user_id",
          foreignField: "user_id",
          as: "Payment",
        },
      },

      {
        $match: query,
      },
      {
        $sort: { user_id: 1 },
      },
    ]);
    if (getdata) {
      console.log(getdata);
      res.status(200).json(getdata);
    } else if (!getdata) {
      res.status(201).json("not found");
    }
  } catch (error) {
    res.status(404).json("error");
  }
});

router.get("/getalldetails_match/:gender", async (req, res) => {
  try {
    const { gender } = req.params;
    const getdata = await User_Personal_Details.aggregate([
      {
        $lookup: {
          from: "user_general_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "general",
        },
      },
      {
        $lookup: {
          from: "user_educational_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "educational",
        },
      },

      {
        $lookup: {
          from: "user_partner_details",
          localField: "user_id",
          foreignField: "user_id",
          as: "partner",
        },
      },
      {
        $lookup: {
          from: "user_passwords",
          localField: "user_id",
          foreignField: "user_id",
          as: "contact",
        },
      },
      {
        $lookup: {
          from: "user_kundalis",
          localField: "user_id",
          foreignField: "user_id",
          as: "kundalis",
        },
      },
      {
        $lookup: {
          from: "user_photos",
          localField: "user_id",
          foreignField: "user_id",
          as: "Details",
        },
      },
      {
        $lookup: {
          from: "user_payments",
          localField: "user_id",
          foreignField: "user_id",
          as: "Payment",
        },
      },
      {
        $match: { user_gender: gender },
      },
    ]);
    if (getdata) {
      console.log(getdata);
      res.status(200).json(getdata);
    } else if (!getdata) {
      res.status(201).json("not found");
    }
  } catch (error) {
    res.status(404).json("error");
  }
});

//country options
router.get("/getcountry", async (req, res) => {
  try {
              
    const feedback = await Country.find();
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});

//state options
router.get("/getstate/:c", async (req, res) => {
  try {
              
    const {c} = req.params;       
    const feedback = await State.find({ countrycode: c });
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});
//partner 
router.get("/getstateall/:c", async (req, res) => {
  try {  
    const { c } = req.params;    
    console.log(c);
    var arr = c.split(",");
    const feedback = await State.find({countrycode:{$in:arr}});
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});




//city options
router.get("/getcity/:c", async (req, res) => {
  try {
              
    const { c } = req.params;  
    const feedback = await City.find({statecode:c});
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});

router.get("/getcityall/:c", async (req, res) => {
  try {
              
    const { c } = req.params;      
    var arr = c.split(",");
    const feedback = await City.find({statecode:{$in:arr}});
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});


//Religion options
router.get("/getreligion", async (req, res) => {
  try {
              
    const feedback = await Religion.find();
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});

//Caste options
router.get("/getcaste/:c", async (req, res) => {
  try {
              
    const { c} = req.params;       
    const feedback = await Caste.find({religion:c});
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});



//language options
router.get("/getlanguage", async (req, res) => {
  try {
              
    const feedback = await Language.find();
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
  }
  
});


// admin side routing

router.post("/Plan",async(req,res)=>{      
  try{
    
    const { P_name, P_duration, P_op, P_amount,P_discount, P_description, enable } = req.body;
    if(!P_name||!P_duration||!P_op||!P_amount||!P_description){
      res.status(422).json("fill all the details")
    }
    const prePlan=await Plan.findOne({P_name:P_name});
    if(prePlan){
      res.status(404).json("this paln is already registered!!");
    }
    else {
      console.log("else ")
    const addPlan= new Plan({P_name,P_duration,P_op,P_amount,P_discount,P_description,enable});
      await addPlan.save();
      console.log(addPlan)+"bye";
    res.status(201).json(addPlan);
    console.log(addPlan);
    }
  }
 catch(error){
    res.status(404).json(error);
 }
});

router.get("/getplan", async (req, res) => {
  try {
               const plan = await Plan.find();
               console.log(plan);
               res.status(201).json(plan);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});


router.get("/getplan/:id", async (req, res) => {
  try {
              const {id}=req.params;
               const plan = await Plan.findById({_id:id});
               console.log(plan);
               res.status(201).json(plan);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});

router.post("/add_c",async(req,res)=>{      
  try{
    
    const {name,isCode}=req.body;
    if(!name||!isCode){
      res.status(422).json("fill all the details")
    }
    const prePlan=await Country.findOne({name:name});
    console.log(prePlan);
    if(prePlan){
      res.status(404).json("this Country is already registered!!");
    }
    else{
    const addPlan=new Country({name,isCode});
    await addPlan.save();
    res.status(201).json(addPlan);
    console.log(addPlan);
    }
  }
 catch(error){
    res.status(404).json(error);
 }
});


router.post("/add_s",async(req,res)=>{      
  try{
    
    const {name,countrycode}=req.body;
    if(!name||!countrycode){
      res.status(422).json("fill all the details")
    }
    const prePlan=await State.findOne({name:name,countrycode:countrycode});
    console.log(prePlan);
    if(prePlan){
      res.status(404).json("this State is already registered!!");
    }
    else{
    const addPlan=new State({name,countrycode});
    await addPlan.save();
    res.status(201).json(addPlan);
    console.log(addPlan);
    }
  }
 catch(error){
    res.status(404).json(error);
 }
});


router.post("/add_city",async(req,res)=>{      
  try{
    
    const {name,statecode,countrycode}=req.body;
    console.log(req.body);
    if(!name||!statecode||!countrycode){
      res.status(422).json("fill all the details")
    }
    const prePlan=await City.findOne({name:name,statecode:statecode,countrycode:countrycode});
    console.log(prePlan);
    if(prePlan){
      res.status(404).json("this City is already registered!!");
    }
    else{
    const addPlan=new City({name,statecode,countrycode});
    await addPlan.save();
    res.status(201).json(addPlan);
    console.log(addPlan);
    }
  }
 catch(error){
    res.status(404).json(error);
 }
});



router.get("/getallcountry", async (req, res) => {
  try {
              
    const feedback = await Country.find();
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});

router.get("/getallreligion", async (req, res) => {
  try {
              
    const feedback = await Religion.find();
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});

router.get("/getallcaste", async (req, res) => {
  try {
              
    const feedback = await Caste.find();
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});

router.get("/getallstate", async (req, res) => {
  try {
              
    const feedback = await State.find();
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});


router.get("/getallcity", async (req, res) => {
  try {
              
    const feedback = await City.find();
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});


router.get("/getalllanguage", async (req, res) => {
  try {
              
    const feedback = await Language.find();
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});

router.post("/add_r",async(req,res)=>{      
  try{
    
    const {name}=req.body;
    if(!name){
      res.status(422).json("fill all the details")
    }
    const prePlan=await Religion.findOne({name:name});
    console.log(prePlan);
    if(prePlan){
      res.status(404).json("this Religion is already registered!!");
    }
    else{
    const addPlan=new Religion({name});
    await addPlan.save();
    res.status(201).json(addPlan);
    console.log(addPlan);
    }
  }
 catch(error){
  console.log(error);
    res.status(404).json(error);
 }
});

router.post("/add_caste",async(req,res)=>{      
  try{
    
    const {name,religion}=req.body;
    if(!name||!religion){
      res.status(422).json("fill all the details")
    }
    const prePlan=await Caste.findOne({name:name,religion:religion});
    console.log(prePlan);
    if(prePlan){
      res.status(404).json("this Caste is already registered!!");
    }
    else{
    const addPlan=new Caste({name,religion});
    await addPlan.save();
    res.status(201).json(addPlan);
    console.log(addPlan);
    }
  }
 catch(error){
    res.status(404).json(error);
 }
});




router.post("/add_language",async(req,res)=>{      
  try{
    
    const {name}=req.body;
    if(!name){
      res.status(422).json("fill all the details")
    }
    const prePlan=await Language.findOne({name:name});
    console.log(prePlan);
    if(prePlan){
      res.status(404).json("this Language is already registered!!");
    }
    else{
    const addPlan=new Language({name});
    await addPlan.save();
    res.status(201).json(addPlan);
    console.log(addPlan);
    }
  }
 catch(error){
    res.status(404).json(error);
 }
});

router.get("/feedback", async (req, res) => {
  try {
              
    const feedback = await User_Feedback.find();
    console.log(feedback);
    res.status(201).json(feedback);
           }
           catch (error) {
               res.status(404).json(error);
      
          }
});


router.patch("/updateplan/:id", async (req, res) => {
    try {
           const { id } = req.params;
           const updateplan = await Plan.findByIdAndUpdate(id, req.body, {
               new: true
           });
           console.log("updated");
           req.status(201).json(updateplan);
       }
     catch (error) {
         console.log("error")
           res.status(422).json(error);
  
      }
   })

   router.delete("/deleteplan/:id", async (req, res) => {
    try {
                const {id}=req.params;
                 const deleteplan = await Plan.findByIdAndDelete({_id:id});
                 console.log(deleteplan);
                 res.status(201).json(deleteplan);
             }
             catch (error) {
                 res.status(404).json(error);
        
            }
  });

  router.put('/enable/:id',async(req,res)=>{
    try {
      const { id } = req.params;
      const updateplan = await Plan.findByIdAndUpdate(id, {
        $set :{
          enable:1
        }
      }, {
          new: true
      });
      console.log("updated");
  }
catch (error) {
    console.log("error")
      res.status(422).json(error);

 }
  })

  router.put('/disable/:id',async(req,res)=>{
    try {
      const { id } = req.params;
      const updateplan = await Plan.findByIdAndUpdate(id, {
        $set :{
           enable:0
        }
      }, {
          new: true
      });
      console.log("updated");
  }
catch (error) {
    console.log("error")
      res.status(422).json(error);

 }
  })
  //Payment info
  router.get("/user_payment", async (req, res) => {
    try {
      let D= (req.query.payment_date) || '';
    const s=parseInt(req.query.approval_status) || 0;
    const page =parseInt(req.query.page)-1 || 0;
   const  limit =parseInt(req.query.limit) || 5;
    const search=req.query.search || "";
    console.log(req.query);
  
   const query ={
    "$or":[
   {"transaction_id" :{$regex:search,$options:"i"}},
   {"user_id" :{$regex:search,$options:"i"}},
    ]
 } 
 if(s){
  query.approval_status=s;
 }
 if(D){
  let G=new Date(D);
  let l= new Date(new Date(D).setHours(29,30,0o0));
  query.payment_date={$gte:new Date(G),$lt:new Date(l)};
 }
console.log(query);
   
                 const pay = await User_Payment.find(query).skip(page*limit).limit(limit);
                 const total= await User_Payment.countDocuments(query);
                const response={
                  error:false,total,page:page + 1,limit,pay,
                };
                 res.status(201).json(response);
             }
             catch (error) {
                 res.status(404).json(error);
        
            }
  });

  router.put('/approve/:id',async(req,res)=>{
    try {
      let v;
      const { id } = req.params;
      const updateplan = await User_Payment.findByIdAndUpdate(id, {
        $set :{
        approval_status:1
        }
      }, {
          new: true
      });
      console.log("updated");
  }
catch (error) {
    console.log("error")
      res.status(422).json(error);

 }
  })

  router.put('/P_status/:id',async(req,res)=>{
    try {
      
      const { id } = req.params;
      const updateplan = await User_Personal_Details.updateOne({user_id:id}, {
        $set :{
        user_premium_status:1
        }
      }, {
          new: true
      });
      console.log("updated");
  }
catch (error) {
    console.log("error")
      res.status(422).json(error);

 }
  })

  router.put('/reject/:id',async(req,res)=>{
    try {
      const { id } = req.params;
      const updateplan = await User_Payment.findByIdAndUpdate(id, {
        $set :{
        approval_status:-1
        }
      }, {
          new: true
      });
      console.log("updated");
  }
catch (error) {
    console.log("error")
      res.status(422).json(error);

 }
  })

  

  router.patch('/activate_status/:id',async(req,res)=>{
    try {
      const { id } = req.params;
      const updatestatus = await User_Password.updateOne({user_id:id}, {
        $set :{
          activeStatus:false
        }
      }, {
          new: true
      });
      console.log("updated 1" );
      console.log(updatestatus)
  }
catch (error) {
    console.log("error")
      res.status(422).json(error);

 }
  })

  router.patch('/deactivate_status/:id',async(req,res)=>{
    try {
      const { id } = req.params;
      console.log(id)
      const updatestatus = await User_Password.updateOne({user_id:id}, {
        $set :{
          activeStatus:true
        }
      }, {
          new: true
      });
      console.log(updatestatus)
      console.log("updated 2");
  }
catch (error) {
    console.log("error")
      res.status(422).json(error);

 }
  })

  router.post("/check_email", async (req, res) => {
    const { user_email} = req.body;
    try
    {
        console.log(req.body);
        const preuser = await admins.findOne({ email: user_email});
        if (preuser)
        {
            console.log(preuser);
            res.status(200).json(preuser);
        }
        else {
           
            res.status(400).json("not registered");
        }
    }
    catch(error){res.status(404).json(error)}
});



//RESETPASSWORD
router.patch("/update_pass/:id", async (req, res) => {
  try {
      const {id } = req.params;
      console.log(id);
      const { newpass, confirmnewpass } = req.body;
      console.log(req.body);
      const user_passHash = await securePassword(newpass);
      const user_cpassHash = await securePassword(confirmnewpass);
      const updateuser = await admins.findByIdAndUpdate(id, {
          $set: {
              password: user_passHash,
              cpassword: user_cpassHash,
          }
      }, {
          new: true
      });
      console.log("updated");
      res.status(201).json(updateuser);
  }
  catch (error) {
    console.log(error);
      res.status(422).json(error);
}})

//LOGIN
router.post("/signin",async(req,res)=>{      
  try{
    const {email,password}=req.body;
    if(!email||!password){
      res.status(422).json("fill all the details")
    }
      const user=await admins.findOne({email:email});
      if(user){
        
        const isMatch = bcrypt.compareSync(password, user.password);
        console.log(user.password, password);
        console.log(isMatch);
        if (isMatch)
        {
          res.status(201).json(user);
        }
         else {
          res.status(401).json("password invalid")
         }
      }
      else{
        res.status(406).json("user not found")
      }
     }
     catch(error){
         res.status(402).json("error")
     }
});





//this will fetch all the user who filled the registration form
router.get("/user_signup", async (req, res) => {
    try {
                 const user = await User_Password.find().sort({user_date:-1});
                 console.log(user);
                 res.status(201).json(user);
             }
             catch (error) {
                 res.status(404).json(error);
        
            }
});

//this will fetch all the user who logged in 
router.get("/user_signin", async (req, res) => {
  try {
               const user = await Ipschema.find().sort({login_date:-1});
               console.log(user);
               res.status(201).json(user);
           }
           catch (error) {
               res.status(404).json(error);
          }
});
                                                                                                                                                                                                              
  router.get("/success_story", async (req, res) =>
    { 

      const s=parseInt(req.query.filteruser)  || 0;
            try
               {
                       const user = await Success_Story.find({story_approval_status:s});
                       console.log(user);
                       res.status(201).json(user);
               }
               catch(error){res.status(404).json(error)}   
    });


    router.get("/dash", async (req, res) =>
    { 
            try
               {
                       const user1 = await User_Personal_Details.countDocuments({user_gender:"female"});
                       const user2 = await User_Personal_Details.countDocuments({user_gender:"male"});
                       const P1 = await User_Payment.countDocuments({approval_status:1});
                       const P2 = await User_Personal_Details.countDocuments({user_premium_status:0});
                       const S=await User_Payment.aggregate(
                        [ {
                          $match:{
                            approval_status:1
                          }
                        },

                       {$group:{
                            _id:null,total_amount:{$sum:"$amount_received"},count:{$sum:1}
                       }
                       },

                        ]
                       )
                       const response={
                        error:false,user1,user2,P1,P2,S,
                      };
                       res.status(201).json(response);
               
               }
               catch(error){res.status(404).json(error)}
    
        
    });

    router.put('/approve_success/:id',async(req,res)=>{
      try {
        const { id } = req.params;
        const updateplan = await Success_Story.findByIdAndUpdate(id, {
          $set :{
            story_approval_status:1
          }
        }, {
            new: true
        });
        console.log("updated");
    }
  catch (error) {
      console.log("error")
        res.status(422).json(error);
  
   }
    })
  
    router.put('/reject_success/:id',async(req,res)=>{
      try {
        const { id } = req.params;
        const updateplan = await Success_Story.findByIdAndUpdate(id, {
          $set :{
            story_approval_status:-1
          }
        }, {
            new: true
        });
        console.log("updated");
    }
  catch (error) {
      console.log("error")
        res.status(422).json(error);
  
   }
    })

    router.get("/user_details", async (req, res) => {
      try{
       const page =parseInt(req.query.page)-1 || 0;
        const  limit =parseInt(req.query.limit) || 4;
          const search=req.query.search || "";
          console.log(req.query);
          const query ={
       
            user_id:{$regex:search,$options:"i"}
     
          }
         const details = await User_Personal_Details.aggregate([
           {
           
             $lookup: {
               from: "user_passwords",
               localField: "user_id",
               foreignField: "user_id",
               as: "contact",
             },
           },
            {
             $match:{
                 user_id: {$regex:search,$options:"i"} 
             }
            },
         ]).skip(page*limit).limit(limit);
         
         const total= await User_Personal_Details.countDocuments(query);
                      const response={
                        error:false,total,page:page + 1,limit,details,
                      };
                       res.status(201).json(response);
   
       } catch (error) {
   
       
         console.log(error);
         res.status(404).json("error");
       }
     });
   
     router.get("/user_Pdetails", async (req, res) => {
       try {
         const page =parseInt(req.query.page)-1 || 0;
        const  limit =parseInt(req.query.limit) || 4;
         const search=req.query.search || "";
         console.log(req.query);
         const query ={
       
           user_id:{$regex:search,$options:"i"}
           
         }
         query.user_premium_status=1;
                    const details = await User_Personal_Details.find(query).skip(page*limit).limit(limit);
                    const total= await User_Personal_Details.countDocuments(query);
                   const response={
                     error:false,total,page:page + 1,limit,details,
                   };
                    res.status(201).json(response);
                }
                catch (error) {
                    res.status(404).json(error);
           
               }
   });
   router.get("/user_Ndetails", async (req, res) => {
     try {
       const page =parseInt(req.query.page)-1 || 0;
      const  limit =parseInt(req.query.limit) || 4;
       const search=req.query.search || "";
       console.log(req.query);
       const query ={
     
         user_id:{$regex:search,$options:"i"}
         
       }
       query.user_premium_status=0;
                  const details = await User_Personal_Details.find(query).skip(page*limit).limit(limit);
                  const total= await User_Personal_Details.countDocuments(query);
                 const response={
                   error:false,total,page:page + 1,limit,details,
                 };
                  res.status(201).json(response);
              }
              catch (error) {
                  res.status(404).json(error);
         
             }
   });
   
   router.get("/getpersonaldata/:uid", async (req, res) => {
     try {
       const { uid } = req.params;
   
       const data = await User_Personal_Details.findById({_id: uid });
       console.log(data);
   
       if (data) {
         console.log(data);
         res.status(200).json(data);
       } else {
         res.status(201).json("data not found");
       }
     } catch (error) {
       console.log(error);
       res.status(404).json("error");
     }
   });

     router.get("/getpersonal/:id", async (req, res) => {
       try {
                    const { id } = req.params;
                    const user = await User_Personal_Details.findById({_id:id});
                   
                    res.status(201).json(user);
                }
                catch (error) {
                    res.status(404).json(error);
           
               }
               
   });
   router.get("/getgeneral/:id", async (req, res) => {
     try {
                  const { id } = req.params;
                  const user = await User_General_Details.findOne({user_id:id});
                  res.status(201).json(user);
              }
              catch (error) {
               console.log(error);
                  res.status(404).json(error);
         
             }
   });
   router.get("/getpartner/:id", async (req, res) => {
     try {
                  const { id } = req.params;
                  const user = await User_Partner_Details.findOne({user_id:id});
                  res.status(201).json(user);
              }
              catch (error) {
               console.log(error)
   
                  res.status(404).json(error);
         
             }
   });
   router.get("/geteducation/:id", async (req, res) => {
     try {
                  const { id } = req.params;
                  const user = await User_Educational_Details.findOne({user_id:id});
                  res.status(201).json(user);
              }
              catch (error) {
               console.log(error)
   
                  res.status(404).json(error);
         
             }
   });
   
   
   router.get("/user_amount/:id", async (req, res) => {
     try {
                  const { id } = req.params;
                  const user = await User_Payment.findOne({_id:id});
                  res.status(201).json(user);
              }
              catch (error) {
               console.log(error)
   
                  res.status(404).json(error);
         
             }
   });
   
   router.patch('/Eamount/:id',async(req,res)=>{
     try {
       const { id } = req.params;
       const {amount_received}=req.body;
       const updateplan = await User_Payment.findByIdAndUpdate(id, {
      $set:{ amount_received:amount_received
      }  
       }, {
           new: true
       });
       console.log(updateplan);
       console.log("updated amount");
       res.status(200).json(updateplan);
   }
   catch (error) {
     console.log(error)
       res.status(422).json(error);
   
   }
   })
   
   
   router.get("/user_details", async (req, res) => {
    try{
     const page =parseInt(req.query.page)-1 || 0;
      const  limit =parseInt(req.query.limit) || 4;
        const search=req.query.search || "";
        console.log(req.query);
        const query ={
     
          user_id:{$regex:search,$options:"i"}
   
        }
       const details = await User_Personal_Details.aggregate([
         {
         
           $lookup: {
             from: "user_passwords",
             localField: "user_id",
             foreignField: "user_id",
             as: "contact",
           },
         },
          {
           $match:{
               user_id: {$regex:search,$options:"i"} 
           }
          },
       ]).skip(page*limit).limit(limit);
       
       const total= await User_Personal_Details.countDocuments(query);
                    const response={
                      error:false,total,page:page + 1,limit,details,
                    };
                     res.status(201).json(response);
 
     } catch (error) {
 
     
       console.log(error);
       res.status(404).json("error");
     }
   });
 
   router.get("/user_Pdetails", async (req, res) => {
     try {
       const page =parseInt(req.query.page)-1 || 0;
      const  limit =parseInt(req.query.limit) || 4;
       const search=req.query.search || "";
       console.log(req.query);
       const query ={
     
         user_id:{$regex:search,$options:"i"}
         
       }
       query.user_premium_status=1;
                  const details = await User_Personal_Details.find(query).skip(page*limit).limit(limit);
                  const total= await User_Personal_Details.countDocuments(query);
                 const response={
                   error:false,total,page:page + 1,limit,details,
                 };
                  res.status(201).json(response);
              }
              catch (error) {
                  res.status(404).json(error);
         
             }
 });
 router.get("/user_Ndetails", async (req, res) => {
   try {
     const page =parseInt(req.query.page)-1 || 0;
    const  limit =parseInt(req.query.limit) || 4;
     const search=req.query.search || "";
     console.log(req.query);
     const query ={
   
       user_id:{$regex:search,$options:"i"}
       
     }
     query.user_premium_status=0;
                const details = await User_Personal_Details.find(query).skip(page*limit).limit(limit);
                const total= await User_Personal_Details.countDocuments(query);
               const response={
                 error:false,total,page:page + 1,limit,details,
               };
                res.status(201).json(response);
            }
            catch (error) {
                res.status(404).json(error);
       
           }
 });
 
 router.get("/getpersonaldata/:uid", async (req, res) => {
   try {
     const { uid } = req.params;
 
     const data = await User_Personal_Details.findById({_id: uid });
     console.log(data);
 
     if (data) {
       console.log(data);
       res.status(200).json(data);
     } else {
       res.status(201).json("data not found");
     }
   } catch (error) {
     console.log(error);
     res.status(404).json("error");
   }
 });
   router.get("/getpersonal/:id", async (req, res) => {
     try {
                  const { id } = req.params;
                  const user = await User_Personal_Details.findById({_id:id});
                 
                  res.status(201).json(user);
              }
              catch (error) {
                  res.status(404).json(error);
         
             }
             
 });
 router.get("/getgeneral/:id", async (req, res) => {
   try {
                const { id } = req.params;
                const user = await User_General_Details.findOne({user_id:id});
                res.status(201).json(user);
            }
            catch (error) {
             console.log(error);
                res.status(404).json(error);
       
           }
 });
 router.get("/getpartner/:id", async (req, res) => {
   try {
                const { id } = req.params;
                const user = await User_Partner_Details.findOne({user_id:id});
                res.status(201).json(user);
            }
            catch (error) {
             console.log(error)
 
                res.status(404).json(error);
       
           }
 });
 router.get("/geteducation/:id", async (req, res) => {
   try {
                const { id } = req.params;
                const user = await User_Educational_Details.findOne({user_id:id});
                res.status(201).json(user);
            }
            catch (error) {
             console.log(error)
 
                res.status(404).json(error);
       
           }
 });
 
 
 router.get("/user_amount/:id", async (req, res) => {
   try {
                const { id } = req.params;
                const user = await User_Payment.findOne({_id:id});
                res.status(201).json(user);
            }
            catch (error) {
             console.log(error)
 
                res.status(404).json(error);
       
           }
 });
 
 router.patch('/Eamount/:id',async(req,res)=>{
   try {
     const { id } = req.params;
     const {amount_received}=req.body;
     const updateplan = await User_Payment.findByIdAndUpdate(id, {
    $set:{ amount_received:amount_received
    }  
     }, {
         new: true
     });
     console.log(updateplan);
     console.log("updated amount");
     res.status(200).json(updateplan);
 }
 catch (error) {
   console.log(error)
     res.status(422).json(error);
 
 }
 })
 
 




router.delete('/delete_user/:id',async(req,res)=>{
 try {
   const { id } = req.params;
   const deleteu = await User_Personal_Details.findByIdAndDelete({_id:id});
   console.log("user delete");
   res.status(200).json(deleteu);
}
catch (error) {
   console.log(error)
   res.status(422).json(error);

}
})

router.delete('/deletedetail/:id',async(req,res)=>{
 try {
   const { id } = req.params;
   const delete_pass=await User_Password.deleteOne({user_id:id});
   const deleteg = await User_General_Details.deleteOne({user_id:id});
   const deletep = await User_Partner_Details.deleteOne({user_id:id});
   const deletee = await User_Educational_Details.deleteOne({user_id:id});
   const response={
     error:false,deleteg,deletep,deletee,delete_pass
   };
   console.log("user deleted");
   res.status(200).json(response);
}
catch (error) {
   console.log(error)
   res.status(422).json(error);

}
})

router.delete('/delete_country/:id/:c',async(req,res)=>{
 try {
   const { id,c } = req.params;
   const deletecity=await City.deleteMany({countrycode:c})
   const deletes=await State.deleteMany({countrycode:c})
   const deletec = await Country.findByIdAndDelete({_id:id});
   console.log("country delete");
   const response={
     error:false,deletecity,deletes,deletec,
   };
   res.status(200).json(response);
}
catch (error) {
   console.log(error)
   res.status(422).json(error);

}
})

router.delete('/delete_state/:id/:s',async(req,res)=>{
 try {
   const { id,s } = req.params;
   const deletecity=await City.deleteMany({statecode:s})
   const deletes=await State.findByIdAndDelete({_id:id})
   console.log("state delete");
   const response={
     error:false,deletecity,deletes,
   };
   res.status(200).json(response);
}
catch (error) {
   console.log(error)
   res.status(422).json(error);

}
})

router.delete('/delete_city/:id',async(req,res)=>{
 try {
   const { id } = req.params;
   const deletecity=await City.findByIdAndDelete({_id:id})
   console.log("city delete");
   const response={
     error:false,deletecity,
   };
   res.status(200).json(response);
}
catch (error) {
   console.log(error)
   res.status(422).json(error);

}
})

router.delete('/delete_religion/:id/:r',async(req,res)=>{
 try {
   const { id ,r} = req.params;
   const deletecaste=await Caste.deleteMany({religion:r});
   const deletereligion=await Religion.findByIdAndDelete({_id:id})
   console.log("state delete");
   const response={
     error:false,deletecaste,deletereligion
   };
   res.status(200).json(response);
}
catch (error) {
   console.log(error)
   res.status(422).json(error);

}
})
    

router.delete('/delete_caste/:id',async(req,res)=>{
 try {
   const { id } = req.params;
   const deletecaste=await Caste.findByIdAndDelete({_id:id});
   console.log("state delete");
   const response={
     error:false,deletecaste,
   };
   res.status(200).json(response);
}
catch (error) {
   console.log(error)
   res.status(422).json(error);

}
})
router.delete('/delete_language/:id',async(req,res)=>{
 try {
   const { id } = req.params;
   const deletelang=await Language.findByIdAndDelete({_id:id});
   console.log("state delete");
   const response={
     error:false,deletelang,
   };
   res.status(200).json(response);
}
catch (error) {
   console.log(error)
   res.status(422).json(error);

}
})


//this will check registered if already then it will not be inserted
router.post("/Auser_signup", async (req, res) => {
  const {
    name,email,password,cpassword} = req.body;
  try {
    console.log(req.body);
    const preuser = await admins.findOne({email:email });
    if (preuser) {
      console.log(preuser);
      res.status(400).json("You are Already Registered");
    } else {
      const adduser = new admins({
     name,email,password,cpassword
      });
     //here we have to hash encrypt paassword
      
      await adduser.save();
      console.log(adduser);
      res.status(200).json(adduser);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});


module.exports = router;
