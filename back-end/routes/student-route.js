const express = require("express");
const { fetchAllStudents, fetchStudentById } = require("../controllers/student-controller");

const router = express.Router();

// GET all students
router.get("/", fetchAllStudents);

// GET a student by ID
router.get("/:id", fetchStudentById);

module.exports = router;
