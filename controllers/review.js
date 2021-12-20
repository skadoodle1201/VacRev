const Review = require('../models/reviews');

module.exports.WriteReview = async(req,res,next)=>{
        const review  = new Review(req.body.review);
        review.author = req.user._id;
        review.centerID = req.cookies.centerId;
        await review.save();
        req.flash('success' , 'Successfully Posted A Review');
        res.redirect(`/center`)
}

module.exports.deleteReview =async(req,res,next) => {
        const {reviewId }  = req.params;
        await Review.findByIdAndDelete(reviewId);
        req.flash('success' , 'Successfully Deleted Your Review');
        res.redirect(`/center`);
}