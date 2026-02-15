const jwt = require("jsonwebtoken");
const User_Password = require("../models/SignUpSchema");

const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.jwtoken;

    if (!token) {
      return res.status(401).send("unauthorized: No token found");
    }

    // 2. Verify Token
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    // 3. Find User in DB
    const rootUser = await User_Password.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }

    // 4. Attach data to request object
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next(); // Authorization success!
  } catch (err) {
    // Token expire ho gaya ho ya verify na hua ho
    res.status(401).send("unauthorized: Invalid token");
    console.log("Authentication Error:", err.message);
  }
};

module.exports = authenticate;
