const express = require("express");
const { fetchAllCourses, fetchCourseByID, createCourse } = require("../controllers/course-controller.js");

const router = express.Router();

// GET a single course by ID
router.get("/:id", fetchCourseByID);

// GET all courses
router.get("/", fetchAllCourses);

// POST a new course
router.post("/", createCourse);

module.exports = router;
