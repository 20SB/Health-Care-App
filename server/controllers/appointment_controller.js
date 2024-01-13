const Appointment = require("../models/appointment");
const User = require("../models/user");

module.exports.createAppointment = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const {
            title,
            description,
            startDateTime,
            endDateTime,
            location,
            reminders,
            appointmentType,
        } = req.body;

        const appointment = new Appointment({
            user: userId,
            title,
            description,
            startDateTime,
            endDateTime,
            location,
            reminders,
            appointmentType,
        });

        await appointment.save();

        return res.status(201).json({
            message: "Appointment created successfully",
            appointment,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.updateAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            req.body,
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({
                message: "Appointment not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Appointment updated successfully",
            appointment: updatedAppointment,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;

        const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

        if (!deletedAppointment) {
            return res.status(404).json({
                message: "Appointment not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Appointment deleted successfully",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Controller function to get all appointments within a date range
module.exports.getAppointmentsInRange = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { startDate, endDate } = req.body;

        // Find the user in the database based on the provided user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Find all appointments for the user within the specified date range
        const appointments = await Appointment.find({
            user: userId,
            startDateTime: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });

        return res.status(200).json({
            message: "Appointments fetched successfully",
            appointments,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};