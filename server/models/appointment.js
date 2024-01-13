const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        startDateTime: {
            type: Date,
            required: true,
        },
        endDateTime: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
        },
        reminders: [
            {
                type: String,
                enum: ["15 minutes before", "1 hour before", "1 day before"],
            },
        ],
        appointmentType: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
