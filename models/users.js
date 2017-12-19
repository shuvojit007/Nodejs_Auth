const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = mongoose.Schema({

    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        require: true
    },
    local: {
        email: {
            //here we remove the required 
            type: String,
            lowercase: true
        },
        password: {
            type: String,
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    }
});

//arrow funciton doesn't support this keyword for this here 
//we called  function in a old Fashion way
UserSchema.pre('save', async function(next) {
    try {
        //if we use OAuth then we dont need to 
        //hash the password
        if (this.method !== 'local') {
            next();
        }
        //Generate a Salt 
        const salt = await bcrypt.genSalt(11)
        const passHash = await bcrypt.hash(this.local.password, salt)
        console.log("Normal Pass ", this.password);
        console.log('Salt Pass ', passHash)
        this.local.password = passHash;
        next()
    } catch (error) {
        next(error);
    }
});

//To chekc is the given pass is correct or not
UserSchema.methods.isValidPassword = async function(newPass) {
    try {
        return await bcrypt.compare(newPass, this.local.password)
    } catch (error) {
        throw new Error(error);
    }
}
const User = mongoose.model('user', UserSchema);
module.exports = User;