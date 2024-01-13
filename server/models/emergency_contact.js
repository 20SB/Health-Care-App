const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        relationship: {
            type: String,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
        },
        dp: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const EmergencyContact = mongoose.model("EmergencyContact", emergencyContactSchema);

module.exports = EmergencyContact;
