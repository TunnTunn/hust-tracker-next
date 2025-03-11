const Course = require("../models/Course.js");

// Fetch all courses
const fetchAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find();
        res.json({ allCourses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Fetch a single course by ID
const fetchCourseByID = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a new course
const createCourse = async (req, res) => {
    try {
        const newCourse = await Course.create(req.body);
        res.status(201).json(newCourse);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { fetchAllCourses, fetchCourseByID, createCourse };
