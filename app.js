require("dotenv").config({path:'./config.env'});
const express =require("express");
const app =express();
const cors =require("cors");
require("./database/conn");
const authenticate = require("./middleware/authenticate");
const router = require("./routes/router");
app.use(cors())
const Cookie_par = require("cookie-parser");
app.use(Cookie_par());
const port =  process.env.PORT||8003;
app.use(express.json());
app.use('/succes_photo', express.static('succes_photo'));
app.use('/images', express.static('images'));
app.use('/kundali',express.static('kundali'));
const kundaliRouter = require('./routes/kundali_router');
app.use('/kundali_router', kundaliRouter);
const userRouter = require('./routes/photo_router');
app.use('/photo_router', userRouter);
const SuccessRouter = require('./routes/success_router');
const cookieParser = require("cookie-parser");
app.use('/success_router', SuccessRouter);
app.use(router);
app.listen(port,()=>{
    console.log("server is started !!");
}); 
