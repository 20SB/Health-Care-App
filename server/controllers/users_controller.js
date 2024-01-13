const User = require("../models/user");
const EmergencyContact = require("../models/emergency_contact");
const jwt = require("jsonwebtoken");
const env = require("../config/environment");
const fs = require("fs");

// Controller function to create a user with emergency contacts
module.exports.createUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(409).json({ message: "User already exists", success: false });
        } else {
            const { password, email, name, dob, sex } = req.body;

            let dp = "";
            if (req.file) {
                dp = `/${req.file.path}`;
            }
            // Create a new user instance
            const user = new User({
                password,
                email,
                name,
                dob,
                sex,
                dp,
            });

            // Save the user to the database
            await user.save();

            return res
                .status(200)
                .json({ message: "User created successfully", user, success: true });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Controller function to create a session (sign in)
module.exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;

        // Find a user in the database based on the provided email
        let user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: "Invalid username", success: false });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password", success: false });
        }

        const userId = user._id;

        // If user is found and password matches, create a JWT token for the user and return the res
        return res.status(200).json({
            message: "Sign In Successful",
            data: {
                token: jwt.sign(user.toJSON(), env.jwtSecret, {
                    expiresIn: "1000000",
                }),
            },
            success: true,
            userId,
        });
    } catch (err) {
        console.log("Internal Server Error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// Controller function to update user information
module.exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user in the database based on the provided user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Update user information with the data from the request body
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        user.name = req.body.name || user.name;
        user.dob = req.body.dob || user.dob;
        user.sex = req.body.sex || user.sex;

        // Handle dp update: Delete previous dp if new dp is provided
        if (req.file) {
            // Delete the previous dp if it exists
            if (user.dp) {
                fs.unlinkSync(`./${user.dp}`);
            }
            // Set the new dp path
            user.dp = `/${req.file.path}`;
        }

        // Save the updated user information to the database
        await user.save();

        return res.status(200).json({
            message: "User updated successfully",
            user,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Controller function to fetch all emergency contacts of a user
module.exports.getEmergencyContacts = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user in the database based on the provided user ID
        const user = await User.findById(userId).populate("emergencyContacts");

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Extract emergency contacts
        const emergencyContacts = user.emergencyContacts;

        return res.status(200).json({
            message: "Emergency contacts fetched successfully",
            emergencyContacts,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
