const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment_controller");

// Create a new appointment
router.post("/add/:userId", appointmentController.createAppointment);

// Update an existing appointment
router.put("/update/:appointmentId", appointmentController.updateAppointment);

// Delete an appointment
router.delete("/delete/:appointmentId", appointmentController.deleteAppointment);

router.get("/get_appointments/:userId", appointmentController.getAppointmentsInRange);

module.exports = router;
