const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});

//arrow funciton doesn't support this keyword for this here 
//we called  function in a old Fashion way
UserSchema.pre('save', async function(next) {
    try {
        //Generate a Salt 
        const salt = await bcrypt.genSalt(11)
        const passHash = await bcrypt.hash(this.password, salt)
        console.log("Normal Pass ", this.password);
        console.log('Salt Pass ', passHash)
        this.password = passHash;
        next()
    } catch (error) {
        next(error);
    }
});

//To chekc is the given pass is correct or not
UserSchema.methods.isValidPassword = async function(newPass) {
    try {
        return await bcrypt.compare(newPass, this.password)
    } catch (error) {
        throw new Error(error);
    }
}
const User = mongoose.model('user', UserSchema);
module.exports = User;