const mongoose = require('mongoose');
const review = require('./review');
const schema = mongoose.Schema;
const listingSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://www.istockphoto.com/photo/53mpix-panorama-of-beautiful-mount-ama-dablam-in-himalayas-nepal-gm2101588899-566432210",
        set: (v) => v === "https://www.istockphoto.com/photo/53mpix-panorama-of-beautiful-mount-ama-dablam-in-himalayas-nepal-gm2101588899-566432210" ? "defult link" : v,
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    } ,
    reviews: [{
        type: schema.Types.ObjectId,
        ref: 'Review'
    }]
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;