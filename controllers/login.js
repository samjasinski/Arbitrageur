const mongoose = require('mongoose');
const userSchema = require('../models/user');
const User = mongoose.model("User", userSchema);
const bcrypt = require('bcrypt');

const loginPlaceholderData = {
  errorPasswordIncorrect: "",
  errorUserDoesNotExist: "",
  userEmail: ""
}

function validateAndLogin(userEmail, userPassword, req, res) {

  User.findOne({
    email: userEmail
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else if (foundUser == null){
      // no user was found
      res.render("login", {
        errorPasswordIncorrect: "",
        errorUserDoesNotExist: "Opps! This email does not exist. Sign up below.",
        userEmail: userEmail
      });
    } else {
      // if user is found
      // check user password matches
      bcrypt.compare(userPassword, foundUser.password, function(err, isMatch) {
        if (err) {
          throw err
        } else if (!isMatch) {
          res.render("login", {
            errorPasswordIncorrect: "Opps! Password does not match.",
            errorUserDoesNotExist: "",
            userEmail: userEmail
          });
        } else {
          // logging user in...
          req.session.user = foundUser;

          res.render("home", {
            userName: req.session.user['name']
          });
        }
      })
    }
  })
}

module.exports = {
  loginPlaceholderData,
  validateAndLogin
}
