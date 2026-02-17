const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });
const User_Password = require("../models/SignUpSchema");

const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from cookies
  const token =
    req.cookies.jwtoken ||
    req.headers.cookie?.split("jwtoken=")[1]?.split(";")[0];

    if (!token) {
      return res.status(401).send("unauthorized: No token found");
    }

    // 2. Verify Token
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    // 3. Find User in DB
    const rootUser = await User_Password.findOne({
      user_id: verifyToken.id,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }

    // 4. Attach data to request object
    req.user = verifyToken;
    console.log(req.user);
    return next(); // Authorization success!
  } catch (err) {
    // Token expire ho gaya ho ya verify na hua ho
    res.status(401).send("unauthorized: Invalid token");
    console.log("Authentication Error:", err.message);
  }
};

module.exports.authenticate = authenticate;
require("dotenv").config({ path: "./config.env" });
const generateToken = ({ id,email}) => {
  return jwt.sign({ id, email }, process.env.SECRET_KEY, {
    expiresIn:"2d",
  });
}

module.exports.generateToken = generateToken;
