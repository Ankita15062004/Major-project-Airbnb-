const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    email: {
        type: String,
        required: true,
       
    }
});

// Apply passport-local-mongoose plugin to add username/password methods
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);


