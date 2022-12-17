const loginController = require('./login')

function validateLogin(user, res) {
  if (user == null) {
    loginController.loginPlaceholderData.errorUserDoesNotExist = "You are not logged in. Please fill in your details and try again."
    res.render("login", loginController.loginPlaceholderData)
  } else {
    res.render("home")
  }
}

module.exports = {
  validateLogin
}
