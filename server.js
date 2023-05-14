// Import libraries and dependencies
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const upload = require('express-fileupload');
const routes = require('./controllers'); // Define the routes for the web application
const helpers = require('./utils/helpers');


const sequelize = require('./config/connection'); // Set up a connection to the MySQL database using Sequalize

const SequelizeStore = require('connect-session-sequelize')(session.Store); // Set up a session store

const app = express(); // Create a new Express.js application instance
const PORT = process.env.PORT || 3001; //Set the port number

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = { //Define the session configuration object
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess)); // Enable session support

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json()); //Middlewares to enable parsing of JSON and urlencoded form data in requests
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory.
app.use(upload());

app.use(routes); //Define the routes

sequelize.sync({ force: false }).then(() => { //Use the Sequelize ORM to synchronize the database schema with the model definitions and start the server
  app.listen(PORT, () => console.log('Now listening'));
});
