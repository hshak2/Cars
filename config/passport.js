
// import passport from 'passport';
// import LocalStrategy from 'passport-local';
// import User from "./models/User.js";


// passport.use(new LocalStrategy(
//   {usernameField: "provided"},
//   async function(provided, password, done){
//     try{
//       const user = await User.findOne({
//         $or:[
//           {email:provided},
//           {username:provided},
//         ]
//       })
//       // error specific messaging
//       if (!user) return done(null, false, {message: "invalid credentials"});
//       const isMatch = await user.comparePassword(password);
//       if (!isMatch) return done(null,false,{message: "invalid password"});

//       return done(null,user);
//     }catch(e){
//       return done(e);
//     }
//   }
// ));

// passport.serializeUser((user,done) => {
//   done(null,user._id);
// });

// passport.deserializeUser(async (id,done) => {
//   try{
//     const user = await User.findById(id);
//     done(null,user);
//   }catch{
//     done(err);
//   }
// })

// export default passport;
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const validator = require('validator');

const User = require('../models/User');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: { $eq: email.toLowerCase() } })
      .then((user) => {
        if (!user) {
          return done(null, false, { msg: `Email ${email} not found.` });
        }
        if (!user.password) {
          return done(null, false, {
            msg: 'Your account was created with a sign-in provider. You can log in using the provider or an email link. To enable email and password login, set a new password in your profile settings.',
          });
        }
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { msg: 'Invalid email or password.' });
        });
      })
      .catch((err) => done(err));
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    return done(null, await User.findById(id));
  } catch (error) {
    return done(error);
  }
});
