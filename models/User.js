const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String
})


// // Password hash middleware.
 
//  UserSchema.pre('save', function save(next) {
//   const user = this
//   if (!user.isModified('password')) { return next() }
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) { return next(err) }
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) { return next(err) }
//       user.password = hash
//       next()
//     })
//   })
// })
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

// passport.js calls this with a callback, so keep that signature
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, cb)
}

// // Helper method for validating user's password.

// UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
//     cb(err, isMatch)
//   })
// }

// Helper method for validating password for login by password strategy
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword, cb) {
  let isMatch;
  try {
    isMatch = await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    return cb(err);
  }
  cb(null, isMatch);
};


module.exports = mongoose.model('User', UserSchema)