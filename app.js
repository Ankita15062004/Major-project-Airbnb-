const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ejs = require('ejs');
const wrapAsync = require('./utils/wrapasync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require('./models/review');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.send('Hi I am root');
});

const validateListing = (req, res, next) => {
  let {error} =  listingSchema.validateAsync(req.body);
console.log(result);
if (error) {
  let errmsg = error.details.map((el) => el.message).join(',');
  throw new ExpressError(400,errmsg);
} else {
  next();
}
};



const validateReview = (req, res, next) => {
  let {error} =  reviewSchema.validateAsync(req.body);
console.log(result);
if (error) {
  let errmsg = error.details.map((el) => el.message).join(',');
  throw new ExpressError(400,errmsg);
} else {
  next();
}
};





// index route
app.get("/listings",  wrapAsync(async (req,res) =>{
const allListings =  await Listing.find({});
res.render("listings/index", {allListings});
}));
// new route
app.get("/listings/new", (req,res) =>{
    res.render("listings/new");
});

//show route
app.get("/listings/:id",  wrapAsync(async (req,res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));
// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res,next) => {
 const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit",  wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",  wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

//Reviews
//post route for reviews
app.post("/listings/:id/reviews", validateReview,async (req, res) => {
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.Review);


listing.reviews.push(newReview);


await newReview.save();
await listing.save();
res.redirect(`/listings/${listing._id}`);

});




// app.get("/testListing", async (req,res)=> {
//    let  sampleListing = new Listing({
//     title: "my villa",
//     description: "by the beatch",
//     price: 1800,
//     location: "calangut goa",
//     country: "india"
//     });
// await sampleListing.save();
//    console.log("sample listing created") ;
//     res.send("sucessfully created sample listing") ;
// });

// miiddleware
app.all(/.*/, (req, res, next) => {
           
         next(new ExpressError("Page Not Found", 404));
          
          });


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});


app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
