const router = require('express-promise-router')();
const UserController = require('../controllers/user');
const { validateBody, schemas } = require('../helpers/routeHelpers');
const passport = require('passport');
//new we here add the passport middleware which i wrote on config dirrectory 
require('../passport')
const passportSignIn = passport.authenticate('local', { session: false });
const passportSignJWT = passport.authenticate('jwt', { session: false })

router.route('/signup')
    .post(validateBody(schemas.authSchema), UserController.signup);

router.route('/signin')
    .post(validateBody(schemas.authSchema),
        passportSignIn,
        UserController.signin);

router.route('/secret')
    .get(passportSignJWT, UserController.secret);

module.exports = router;