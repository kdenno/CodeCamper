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
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});
// create static method on this model
courseSchema.statics.getAverageCost = async function(bootcampId) {
  // create aggregations that will calculate averages according to the courses already available
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" }
      }
    }
  ]);
  // obj output = [{_id: 50ssjfsgej989f01, averageCost: 1234597}]
  // update the bootcamp model
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (error) {
    console.log(error);
  }
};
// call getAverage cost after save
courseSchema.post("save", function() {
  // since getAverageCost is a static method, we can call it on the model itself
  this.constructor.getAverageCost(this.bootcamp);
});

// re-calculate average cost before remove
courseSchema.pre("remove", function() {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", courseSchema);
