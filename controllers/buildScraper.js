const loginController = require('./login')
const mongoose = require('mongoose');
const scraperSchema = require('../models/scraper');
const Scraper = mongoose.model("Scraper", scraperSchema);
const userSchema = require('../models/user');
const User = mongoose.model("User", userSchema);

watchScraperStream();

function validateLogin(user, res) {
  if (user == null) {
    loginController.loginPlaceholderData.errorUserDoesNotExist = "You are not logged in. Please fill in your details and try again."
    res.render("login", loginController.loginPlaceholderData)
  } else {
    res.render("buildScraper")
  }
}

async function createScraper(platform, target, url, outcomesXpath, oddsXpath, groupBy, req) {

  User.findOne(
    {email: req.session.user.email},
    async (err, foundUser) => {
    if (foundUser) {
      // create a new scraper object
      const newScraper = new Scraper({
        targetPlatform: platform,
        targetSport: target,
        targetUrl: url,
        outcomesXpath: outcomesXpath,
        oddsXpath: oddsXpath,
        groupBy: groupBy
      });

      await newScraper.save()

      foundUser.scrapers.push(newScraper)
      await foundUser.save()

    } else {
      console.log(err)
      res.render("login")
    }
  });
}

async function deleteScraper(scraperId) {
  scraper = scraperId;

  try {
    await Scraper.deleteOne({_id: scraper})
  } catch (error) {
    console.log("ERROR: Failed to delete scraper", error)
  }
}

async function deleteUserScraper(userId, scraperId) {
  user = userId;
  scraper = scraperId;

  try {
    await User.findByIdAndUpdate({_id: user}, {
  $pull: {
    scrapers: {
      _id: scraper
    }
  }
})
  } catch (error) {
    console.log("ERROR: Failed to delete scraper", error)
  }
}

function watchScraperStream() {
  Scraper.watch().on('change', next => {
           // process any change event
           switch (next.operationType) {
               case 'insert':
                   console.log(next.fullDocument.message);
                   break;
               case 'update':
                   console.log(next.updateDescription.updatedFields.message);
           }
})
}

module.exports = {
  validateLogin,
  createScraper,
  deleteScraper,
  deleteUserScraper,
  watchScraperStream
}
