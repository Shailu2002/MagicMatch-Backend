const mongoose = require("mongoose");
const stateschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  countrycode: {
    type: String,
    required: true,
  },
  statecode: { type: String, required: true ,},
});
const State = new mongoose.model("State", stateschema);
module.exports = State;
