const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "https://ui-avatars.com/api/?name=User&background=random" }
});
module.exports = mongoose.model('User', UserSchema);
