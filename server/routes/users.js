const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Import the users controller
const usersController = require("../controllers/users_controller");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync("public")) {
            fs.mkdirSync("public");
        }

        if (!fs.existsSync("public/images")) {
            fs.mkdirSync("public/images");
        }

        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);

        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".gif") {
            return cb(new Error("Only images are allowed!"));
        }

        cb(null, true);
    },
});

// Route to login
router.post("/login", usersController.login);

// Route to create a new user
router.post("/register", upload.single("image"), usersController.createUser);

// Route to create a new user
router.post("/update/:id", upload.single("image"),upload.single("image"), usersController.updateUser);

// Route to login
router.get("/get_emergency_contacts/:id", usersController.getEmergencyContacts);

// Export the router to be used in the main router (index.js)
module.exports = router;
