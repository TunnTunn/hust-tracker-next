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

module.exports = { fetchAllStudents };
