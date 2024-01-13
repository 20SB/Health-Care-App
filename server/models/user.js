const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
        },
        dob: {
            type: Date,
        },
        sex: {
            type: String,
        },
        dp: {
            type: String,
        },
        emergencyContacts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EmergencyContact'
        }],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
