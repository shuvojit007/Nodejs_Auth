const JWT = require('jsonwebtoken');
const User = require('../models/users');
const { JWT_SECRET } = require('../configuration/index');
signToken = (user) => {
    return JWT.sign({
        iss: 'CRUX', //optional
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET);
}

module.exports = {
    signup: async(req, res) => {
        const { email, password } = req.value.body;
        //check if there is a user the same email
        const foundUser = await User.findOne({ email });
        if (foundUser) {
            return res.status(409).json({ error: "Email is already in use " });
        }
        const newUser = new User({ email, password });
        var user = await newUser.save();

        //generateToken
        const token = signToken(newUser);

        // console.log(user);
        res.json({ token: token });

    },
    signin: async(req, res) => {
        console.log(req.user)
            //Generate Token
        const token = signToken(req.user);
        res.status(200).json({ token })
    },
    secret: async(req, res, ) => {
        console.log('I managed to get here!');
        res.json({ secret: "resource" });
    }
}