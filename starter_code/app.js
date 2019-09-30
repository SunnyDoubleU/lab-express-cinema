require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose
  .connect("mongodb://localhost/cinemaApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });
const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    key: "user_sid",
    secret: "basic-auth-secret",
    resave: true,
    saveUninitialized: true, // option when youre setting up the cookie for the session for the first time, whether it will automatically save or not
    cookie: { maxAge: 24 * 60 * 60 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

// Express View engine setup

// app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(express.urlencoded({ extended: true }));

// default value for title local
app.locals.title = "Cinema Ironhack";

var indexRoute = require("./routes/index");
app.use("/", indexRoute);

var moviesRoute = require("./routes/movies");
app.use("/", moviesRoute);

var authRoute = require("./routes/auth");
app.use("/", authRoute);

// module.exports = app;
app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
