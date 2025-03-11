const Student = require("../models/Student");

// Fetch all students
const fetchAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Fetch a student by ID
const fetchStudentById = async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id);
    res.json(student);
};

module.exports = { fetchAllStudents, fetchStudentById };
