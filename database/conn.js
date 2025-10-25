const mongoose = require("mongoose");//import like work
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("connection start")).catch((error) => console.log(error.message));
