const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing');
const {isLoggedIn,isreviewAuthor } = require("../middleware.js");

const validateReview = async (req, res, next) => {
  try {
    await reviewSchema.validateAsync(req.body);
    next();
  } catch (error) {
    let errmsg = error.details.map((el) => el.message).join(',');
    next(new ExpressError(400, errmsg));
  }
};
const reviewController = require("../controller/reviews.js");

//Post Add review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));



// Delete review
router.delete("/:reviewId",isLoggedIn,isreviewAuthor ,wrapAsync(reviewController.destroyReview));

module.exports = router;
