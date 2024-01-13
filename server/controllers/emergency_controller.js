const User = require("../models/user");
const EmergencyContact = require("../models/emergency_contact");
const jwt = require("jsonwebtoken");
const env = require("../config/environment");
const fs = require("fs");
const emergencyMailer  = require("../mailers/emergency_mailer");

// Generate a location link based on latitude and longitude
function generateLocationLink(latitude, longitude) {
    const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    
    return locationLink;
}

// Controller function to add an emergency contact to a user
module.exports.addEmergencyContact = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user in the database based on the provided user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Extract information for the new emergency contact from the request
        const { name, relationship, phone, email } = req.body;

        let dp = "";
        if (req.file) {
            dp = `/${req.file.path}`;
        }

        // Create a new emergency contact instance
        const emergencyContact = new EmergencyContact({
            name,
            relationship,
            phone,
            email,
            dp,
            user: userId,
        });

        // Save the emergency contact to the database
        await emergencyContact.save();

        // Update the user model to include the reference to the new emergency contact
        user.emergencyContacts.push(emergencyContact._id);
        await user.save();

        return res.status(200).json({
            message: "Emergency contact added successfully",
            emergencyContact,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Controller function to update an emergency contact
module.exports.updateEmergencyContact = async (req, res) => {
    try {
        const emergencyContactId = req.params.emergencyContactId;

        // Find the emergency contact in the database based on the provided ID
        const emergencyContact = await EmergencyContact.findById(emergencyContactId);

        if (!emergencyContact) {
            return res.status(404).json({ message: "Emergency contact not found", success: false });
        }

        // Update emergency contact information with the data from the request body
        emergencyContact.name = req.body.name || emergencyContact.name;
        emergencyContact.relationship = req.body.relationship || emergencyContact.relationship;
        emergencyContact.phone = req.body.phone || emergencyContact.phone;
        emergencyContact.email = req.body.email || emergencyContact.email;

        // Handle dp update: Delete previous dp if new dp is provided
        if (req.file) {
            // Delete the previous dp if it exists
            if (emergencyContact.dp) {
                fs.unlinkSync(`./${emergencyContact.dp}`);
            }
            // Set the new dp path
            emergencyContact.dp = `/${req.file.path}`;
        }

        // Save the updated emergency contact information to the database
        await emergencyContact.save();

        return res.status(200).json({
            message: "Emergency contact updated successfully",
            emergencyContact,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Controller function to delete an emergency contact
module.exports.deleteEmergencyContact = async (req, res) => {
    try {
        const userId = req.params.id;
        const emergencyContactId = req.params.emergencyContactId;

        // Find the user in the database based on the provided user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Check if the provided emergency contact ID exists in the user's emergency contacts
        const index = user.emergencyContacts.indexOf(emergencyContactId);
        if (index === -1) {
            return res.status(404).json({ message: "Emergency contact not found", success: false });
        }

        // Remove the emergency contact ID from the user's emergency contacts array
        user.emergencyContacts.splice(index, 1);
        await user.save();

        // Find the emergency contact to get the dp path
        const emergencyContact = await EmergencyContact.findById(emergencyContactId);

        if (!emergencyContact) {
            return res.status(404).json({ message: "Emergency contact not found", success: false });
        }

        // Delete the dp (profile picture) if it exists
        if (emergencyContact.dp) {
            fs.unlinkSync(`./${emergencyContact.dp}`);
        }

        // Delete the emergency contact from the database
        await EmergencyContact.findByIdAndDelete(emergencyContactId);

        return res.status(200).json({
            message: "Emergency contact deleted successfully",
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

// Controller function to fetch all emergency contacts of a user and send emails and messages
module.exports.sendEmergencyNotifications = async (req, res) => {
    try {
        const userId = req.params.id;
        const { latitude, longitude } = req.body;

        // Find the user in the database based on the provided user ID
        const user = await User.findById(userId).populate("emergencyContacts");

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Extract email and phone information from emergency contacts
        const contacts = user.emergencyContacts;

        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ message: "No emergency contacts found", success: false });
        }

        await emergencyMailer.newEmergency(contacts, user, generateLocationLink(latitude, longitude));

        return res.status(200).json({
            message: "Emergency notifications sent successfully",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};