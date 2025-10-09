const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js');
const Listing = require('../models/listing');
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController =  require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });




const validateListing = async (req, res, next) => {
  try {
    await listingSchema.validateAsync(req.body);
    next();
  } catch (error) {
    let errmsg = error.details.map((el) => el.message).join(',');
    next(new ExpressError(400, errmsg));
  }
};

// create, index
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );




// New
router.get("/new", isLoggedIn, listingController.renderNewForm);

// show update delete
router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, wrapAsync(listingController.destroyListing));

// Edit
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.randerEditForm));
module.exports = router;
