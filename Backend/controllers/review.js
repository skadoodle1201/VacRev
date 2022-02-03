const Review = require("../models/reviews");
const User = require("../models/users");
require("@tensorflow/tfjs");
const toxicity = require("@tensorflow-models/toxicity");
const { cos } = require("@tensorflow/tfjs");

const checkForToxicBehaviour = async (review) => {
	const threshold = 0.9;
	const check = await toxicity.load(threshold).then(async (model) => {
		const sentences = [review.toString()];
		const ans = await model.classify(sentences).then((predictions) => {
			const checkup = predictions;
			return checkup;
		});
		return ans;
	});
	return check;
};

module.exports.WriteReview = async (req, res) => {
	const review = new Review(req.body.review);
	const writer = await User.findById(req.user._id);
	const toxicOrNot = await checkForToxicBehaviour(review);
	const check = toxicOrNot[6].results[0].match;
	if (check == null || check == true) {
		req.flash(
			"error",
			"Dont Not be Toxic Please Refrain from using harsh words"
		);
		res.redirect("/findingCenters/center");
	} else {
		review.author = req.user._id;
		review.centerID = req.cookies.centerId;
		review.username = writer.username;
		await review.save();
		req.flash("success", "Successfully Posted A Review");
		res.redirect("/findingCenters/center");
	}
};

module.exports.deleteReview = async (req, res, next) => {
	const { reviewId } = req.params;
	await Review.findByIdAndDelete(reviewId);
	req.flash("success", "Successfully Deleted Your Review");
	res.redirect("/findingCenters/center");
};
