require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const env = require("./config/environment");
const cookieSession = require("cookie-session");

// Require database configuration
const db = require("./config/mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const passport = require("passport");
const passportJWT = require("./config/passport-jwt-startegy");

// Serve static files from the 'assets' directory
app.use(express.static('./assets'));

// Specify the directory where views are located
app.set("views", "./views");

app.use(
    cookieSession({
        name: "session",
        keys: ["cyberwolve"],
        maxAge: 24 * 60 * 60 * 100,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: "*",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

// Use express router for routing
app.use("/", require("./routes"));

app.use("/public", express.static(path.join(__dirname, "public")));
const port = env.port || 5002;

app.listen(port, () => {
    console.log("HCS Server is running on port ", port);
});