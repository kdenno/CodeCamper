const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add title"]
  },
  description: {
    type: String,
    required: [true, "Please add description"]
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"]
  },
  tuition: {
    type: Number,
    required: [true, "Please add tuition cost"]
  },
  minimumSkill: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"]
  },
  scholarshipsAvailable: {
    type: Boolean,
    false: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  }
});

module.exports = mongoose.model("Course", courseSchema);
