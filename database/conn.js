const mongoose = require("mongoose");//import like work
// 1. Connection Stability Check
// Agar mongoose.connection.readyState 1 ya usse zyada hai, toh connection stable hai.
if (mongoose.connection.readyState >= 1) {
  console.log('Using existing DB connection (Warm Start)');
}
else {
  mongoose.connect(process.env.DATABASE
    // ,
    // {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
    // }
  ).then(() => console.log("connection start")).catch((error) => console.log(error.message));
}
