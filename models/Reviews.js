const mongoose = require("mongoose");

const ReviewsSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a number between 1 to 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});
// prevent user from submitting more than 1 review per bootcamp
ReviewsSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// create static method on this model
ReviewsSchema.statics.getAverageRating = async function (bootcampId) {
  // create aggregations that will calculate averages according to the ratings already available
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  // obj output = [{_id: 50ssjfsgej989f01, averageRating: 1234597}]
  // update the bootcamp model
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.log(error);
  }
};
// call getAverateRating after save
ReviewsSchema.post("save", function () {
  // since getAverageRating is a static method, we can call it on the model itself
  this.constructor.getAverageRating(this.bootcamp);
});

// call getAverateRating before remove
ReviewsSchema.pre("remove", function () {
  // since getAverageRating is a static method, we can call it on the model itself
  this.constructor.getAverageRating(this.bootcamp);
});


module.exports = mongoose.model("Review", ReviewsSchema);
