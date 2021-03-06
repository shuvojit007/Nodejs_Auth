const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
//this is for get the token frm header
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const config = require('./configuration/index');
const User = require('./models/users');

//JSON WEB TOKEN STRATEGY (authenticate using token)
passport.use("jwt", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('auth'),
    secretOrKey: config.JWT_SECRET
}, async(payload, done) => {
    //Here we stuck for some moments cz here er didnot handle the promise async function
    try {
        // Find the user specified in token
        const user = await User.findById(payload.sub);

        // If user doesn't exists, handle it
        if (!user) {
            return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

//Google Auth Strategy
passport.use('googleToken',
    new GooglePlusTokenStrategy({
        clientID: config.oauth.google.clientID,
        clientSecret: config.oauth.google.clientSecret
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            console.log('Profile : ', profile);
            console.log('acessToken : ', accessToken);
            console.log('refreshToken : ', refreshToken);
        } catch (error) {
            done(error, false, error.message);
        }
    }))






// LOCAL STRATEGY (Username )
passport.use("local", new LocalStrategy({
    usernameField: 'email'
}, async(email, password, done) => {
    try {
        // Find the user given the email
        const user = await User.findOne({ email }, "_id");

        // If not, handle it
        if (!user) {
            return done(null, false);
        }

        // Check if the password is correct
        //now we called the our isValidPass method which i wrote on 
        // the user model to check is the given pass is correct or not
        const isMatch = user.isValidPassword(password);
        // If not, handle it
        if (!isMatch) { return done(null, false) }
        // Otherwise, return the user
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));