const express = require('express');
const router =  express.Router({mergeParams: true});
const reviews = require('../controllers/review')



const catchAsync = require('../utils/catchAsync');
const{validateReview, isLoggedIn , isReviewAuthor} = require('../middleware')



router.post('/',isLoggedIn ,validateReview, catchAsync(reviews.WriteReview))


router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))



module.exports = router;