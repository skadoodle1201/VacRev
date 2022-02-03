const ExpressErrors = require('./utils/ExpressErrors');
const {reviewSchema } =  require('./Schemas.js');
const Review = require('./models/reviews');

module.exports.isLoggedIn = (req,res,next) =>{
        if(!req.isAuthenticated()){
                req.session.returnTo = req.originalUrl;
                req.flash('error','you must be signed in')
                return res.redirect('/login');
        }
        next();
}


module.exports.validateReview = (req,res,next) => {
        const {error} = reviewSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressErrors(msg,400)
        }
        else{
            next();
        }
}


module.exports.isReviewAuthor = async(req,res,next) =>{
        const {reviewId} = req.params;
        const review = await Review.findById(reviewId);
        if(!review.author.equals(req.user._id)){
                req.flash('error','You dont have permission');
                return res.redirect(`/center`);
        }
        next();
}