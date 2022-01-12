const Review = require("../models/reviews");
const User = require("../models/users");

module.exports.WriteReview = async (req, res) => {
  const review = new Review(req.body.review);
  const writer = await User.findById(req.user._id);
  review.author = req.user._id;
  review.centerID = req.cookies.centerId;
  review.username = writer.username;
  await review.save();
  req.flash("success", "Successfully Posted A Review");
  res.redirect("/findingCenters/center");
};

module.exports.deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully Deleted Your Review");
  res.redirect("/findingCenters/center");
};
