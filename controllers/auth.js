const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')



//   exports.getLoginPage = async (req, res) => {
//     res.render('login');
//   },
  
//   exports.getRegisterPage = async (req, res) => {
//     res.render('signup');
//   },
  
//   // authenticate with passport, success:login, (see passport config for Local Strat and [de]serialization)
//   exports.login = (req,res,next) => {
//     passport.authenticate('local', (err, user, info) => {
//       if (err) return next(err);
//       if (!user) {
//         return res.status(401).json({message: info.message || `check yo'self`});
//       }

//       req.login(user, (err) => {
//         if (err) return next(err);
//         req.session.optOut = user.optOut;
//         return res.status(200).json({redirect:'/cars'});
//       });
//     })(req, res, next);
//   },

//   exports.logout = (req,res,next) => {
//     req.logout((e) => {
//       if (e) return next(e);
//       res.redirect('/');
//     })
//   },

//   // collect user data and register, call login with valid info
//   exports.registerNewUser = async (req,res) => {
//     const {
//       email,
//       password,
//       username
//     } = req.body;

//     const validChars = new Set(' abcdefghijklmnopqrstuvwxyz0123456789,./+=-!@#$%^&*_');
//     const nameUsesValidChars = username.toLowerCase().split('').every(char => validChars.has(char));
//     const nameIsProperLength = 3 <= username.trim().length && username.trim().length <= 40;
//     const passwordUsesValidChars = password.toLowerCase().split('').every(char => validChars.has(char));
//     const passwordIsValidLength = password.trim().length >= 8 && password.trim().length <= 20;

//     const validUsername = nameUsesValidChars && nameIsProperLength;
//     const validPassword = passwordUsesValidChars && passwordIsValidLength;

//     if (!validUsername) return res.status(400).json({message:'invalid username'});
//     if (!validPassword) return res.status(400).json({message: 'invalid password'});

//     try {
//       const user = await User.create({email,username,password});
//       req.login(user,(err) => {
//         if (err) return res.status(500).json({message:"the registration succeeded, but the login failed"});
//         req.session.optOut = user.optOut;
//         return res.status(201).json(user)
//       })
//     }
//     catch (e){
//       let message = e.message;
//       if (e.code === 11000){
//         if (e.keyPattern.email) message = 'Email already Registered'
//         if (e.keyPattern.username) message = 'Username is already Taken'
//       }
//       return res.status(400).json({ message })
//     }

//   }
 exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('/cars')
    }
    res.render('login', {
      title: 'Login'
    })
  }
  
  exports.postLogin = (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('/login')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        req.flash('errors', info)
        return res.redirect('/login')
      }
      req.logIn(user, (err) => {
        if (err) { return next(err) }
        req.flash('success', { msg: 'Success! You are logged in.' })
        res.redirect(req.session.returnTo || '/cars')
      })
    })(req, res, next)
  }
  
  exports.logout = (req, res) => {
    req.logout(() => {
      console.log('User has logged out.')
    })
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null
      res.redirect('/')
    })
  }
  
  exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect('/cars')
    }
    res.render('signup', {
      title: 'Create Account'
    })
  }
  
  exports.postSignup = async (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('../signup')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    })
 


try {
    const existingUser = await User.findOne({ email: { $eq: req.body.email } });

    if (existingUser) {
//       // Always send login link and generic message if email exists
    //   await sendPasswordlessLoginLinkIfUserExists(existingUser, req);
      return res.redirect('/cars');
    }


//     // For regular signup, log the user in
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('/cars');
    });
  } catch (err) {
    next(err);
  }

  }