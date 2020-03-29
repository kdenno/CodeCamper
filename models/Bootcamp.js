const mongoose = require("mongoose");
const bootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add name of bootcamp"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be longer than 50 characters"]
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Enter description"],
    maxlength: [500, "Description can not be longer than 500 characters"]
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please provide valid web address"
    ]
  },
  phone: {
    type: String,
    maxlength: [20, "Phone lenght cant be longer than 20 characters"]
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

      "Please provide a valid email"
    ]
  },
  address: {
    type: String,
    required: [true, "Please add address"]
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: false
    },
    coordinates: {
      type: [Number], // Array of numbers
      required: false,
      index: "2dsphere"
    },
    formattedAddress: String,
    street: String,
    zipcode: String,
    country: String,
    city: String,
    state: String
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other"
    ]
  },
  averateRating: {
    type: Number,
    min: [1, "Rating must be atleast 1"],
    max: [10, "Rating must not be more than 10"]
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg"
  },
  housing: {
    type: String,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Bootcamp", bootcampSchema);
