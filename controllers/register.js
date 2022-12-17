const mongoose = require('mongoose');
const userSchema = require('../models/user');
const User = mongoose.model("User", userSchema);
const bcrypt = require('bcrypt');

const registerPlaceholderData = {
  errorUserExists: "",
  displayName: "",
  userEmail: ""
}

function validateAndRegisterNewUser(displayName, userEmail, userPassword, res) {
  User.findOne({
    email: userEmail
  }, async function(err, foundUser) {

    if (foundUser) {

      res.render("register", {
        errorUserExists: "A user with that email already exists",
        displayName: displayName,
        userEmail: userEmail
      });

    } else {

      // 10 is a good standard value to use here, makes it fairly secure while being quick
      const hashedUserPassword = await bcrypt.hash(userPassword, 10);

      const newUser = new User({
        displayName: displayName,
        email: userEmail,
        password: hashedUserPassword,
        scrapers: [],
        data: []
      });

      newUser.save()

      // user successfully created, redirecting to login page..
      res.redirect("/login");

    }

  })
}

module.exports = {
  registerPlaceholderData,
  validateAndRegisterNewUser
}
