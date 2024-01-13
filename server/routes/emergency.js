const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Import the users controller
const emergencyController = require("../controllers/emergency_controller");

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

// Route to add a new emergency contact
router.post("/add_contact/:id",upload.single("image"), emergencyController.addEmergencyContact);

// Update an emergency contact
router.put("/update_contact/:emergencyContactId", upload.single("image"),emergencyController.updateEmergencyContact);

// Delete an emergency contact
router.delete("/:id/delete_contact/:emergencyContactId",emergencyController.deleteEmergencyContact);


// Export the router to be used in the main router (index.js)
module.exports = router;