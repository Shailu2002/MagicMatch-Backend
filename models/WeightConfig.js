const mongoose = require("mongoose");

const WeightConfigSchema = new mongoose.Schema(
  {
    criteria: {
      type: String,
      required: true,
      unique: true, // 'age', 'profession', etc. unique rahenge
    },
    male_weightage: {
      type: Number,
      required: true, // Jab ladka (Male) search ho raha ho
    },
    female_weightage: {
      type: Number,
      required: true, // Jab ladki (Female) search ho raha ho
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Weightage", WeightConfigSchema);
