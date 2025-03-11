const express = require("express");
const {
    createEnrollment,
    getEnrollmentsByStudent,
    getEnrollmentById,
    updateEnrollment,
    deleteEnrollment,
} = require("../controllers/enrollment-controller");

const router = express.Router();

// Get all enrollments and optionally stats for a student
router.get("/:student_id", getEnrollmentsByStudent);

// Get a specific enrollment
router.get("/detail/:id", getEnrollmentById);

// Create a new enrollment
router.post("/", createEnrollment);

// Update an enrollment
router.put("/:id", updateEnrollment);

// Delete an enrollment
router.delete("/:id", deleteEnrollment);

module.exports = router;
