// require("dotenv").config({path:'./config.env'});
// const express =require("express");
// const app =express();
// const cors =require("cors");
// require("./database/conn");
// const authenticate = require("./middleware/authenticate");
// const router = require("./routes/router");
// app.use(cors())
// const Cookie_par = require("cookie-parser");
// app.use(Cookie_par());
// const port =  process.env.PORT||8003;
// app.use(express.json());
// app.use('/succes_photo', express.static('succes_photo'));
// app.use('/images', express.static('images'));
// app.use('/kundali',express.static('kundali'));
// const kundaliRouter = require('./routes/kundali_router');
// app.use('/kundali_router', kundaliRouter);
// const userRouter = require('./routes/photo_router');
// app.use('/photo_router', userRouter);
// const SuccessRouter = require('./routes/success_router');
// app.use("/success_router", SuccessRouter);
// const cookieParser = require("cookie-parser");
// app.use(router);
// app.listen(port,()=>{
//     console.log("server is started !!");
// });

require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
//  Database Connection
require("./database/conn");
const PORT = process.env.PORT || 8003;
app.set("trust proxy", 1); 
//  Middlewares
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://magic-match-frontend.vercel.app"
        : "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

//  Import Routers
const router = require("./routes/router");
const photoRouter = require("./routes/photo_router");
const successRouter = require("./routes/success_router");
//  Use Routes
app.use("/photo_router", photoRouter);
app.use("/success_router", successRouter);
app.use(router);
//for local machine
if (process.env.NODE_ENV !== "production") {
  app.listen(8003, () => {
    console.log(`running on port no :8003`);
  });
}


module.exports = app;

