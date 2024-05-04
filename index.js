const express = require("express");
const cors = require('cors');
const passport = require('passport');
const path = require('path')
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

const dotenv = require("dotenv")
dotenv.config()

passport.use(new GoogleStrategy({
  clientID:     process.env.clientId,
  clientSecret: process.env.clientSecret,
  callbackURL: "http://localhost:3005/auth/google/callback",
  },
  (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
  }
))
const authRouter = require("./routes/auth");                  //AuthRouter
app.use("/auth", authRouter);


const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`Listening on ${port}...`));