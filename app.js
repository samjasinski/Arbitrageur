//DOTENV
require('dotenv').config();

// BODYPARSER
const bodyParser = require('body-parser');

// EXPRESS
const express = require('express');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs'); // sets ejs as the view engine
app.use(express.static('public')) // serve static files
app.use(express.json()); // related to mongoose
app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(session({
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true
// }));

// EJS
const ejs = require('ejs')

// BCRYPT
const bcrypt = require('bcrypt');

// VARIABLES
const PORT = process.env.PORT || 3000;
const username = process.env.dbUsername
const password = process.env.dbPassword
const cluster = process.env.clusterName
const dbname = process.env.dbName

// MONGOOSE
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

// SOCKET.IO
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

const sessionMiddleware = session({
  secret: process.env.SECRET,
    resave: false,
      saveUninitialized: true
});

app.use(sessionMiddleware);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));


// CONTROLLERS
const loginController = require('./controllers/login')
const registerController = require('./controllers/register')
const homeController = require('./controllers/home')
const buildScraperController = require('./controllers/buildScraper')

// GET
app.get("/", (req, res) => {
  res.render("login", loginController.loginPlaceholderData)
})

app.get("/login", (req, res) => {
  res.render("login", loginController.loginPlaceholderData)
})

app.get("/register", (req, res) => {
  res.render("register", registerController.registerPlaceholderData)
})

app.get("/logout", (req, res) => {
  req.session.user = null;
  res.render("login", loginController.loginPlaceholderData)
});

app.get("/home", async (req, res) => {
homeController.validateLogin(req.session.user, res)
});

app.get("/buildScraper", async (req, res) => {
  buildScraperController.validateLogin(req.session.user, res)
})

app.get("/scraperLibrary", async (req, res) => {
  res.render("scraperLibrary", {userScrapersArray: req.session.user['scrapers']})
})

app.get("/testScraper", async (req, res) => {
  res.render("testScraper")
})

// POST
app.post("/login", function(req, res) {
  loginController.validateAndLogin(req.body.userEmail, req.body.userPassword, req, res)
})

app.post("/register", function(req, res) {
  registerController.validateAndRegisterNewUser(req.body.displayName, req.body.userEmail, req.body.userPassword, res)
})

app.post("/logout", (req, res) => {
  req.session.user = null;
  res.render("login", loginController.loginPlaceholderData)
});

app.post('/buildScraper', async (req, res) => {

  await buildScraperController.
  createScraper(
    req.body.platform,
    req.body.target,
    req.body.url,
    req.body.outcomesXpath,
    req.body.oddsXpath,
    req.body.groupBy,
    req
  )

  // need to reload user session?

  res.render("scraperLibrary", {userScrapersArray: req.session.user['scrapers']})
})

app.post('/buildScraper/delete', async (req, res) => {
  buildScraperController.watchScraperStream()

  scraper = req.body['scraperId']
  await buildScraperController.deleteScraper(scraper)

  user = req.session.user['_id']
  await buildScraperController.deleteUserScraper(user, scraper)



  // go back to Library
})

// SOCKET.IO
io.on('connection', function(socket) {
   console.log('A user connected');

   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});

// LISTEN
server.listen(PORT, console.log("SERVER STARTED ON PORT [ " + PORT + " ]\n APPLICATION RUNNING AT: http://localhost:3000/"))
