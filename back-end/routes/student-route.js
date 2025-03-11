const express = require("express");
const { fetchAllStudents } = require("../controllers/student-controller");

const router = express.Router();

// GET all students
router.get("/", fetchAllStudents);

module.exports = router;
