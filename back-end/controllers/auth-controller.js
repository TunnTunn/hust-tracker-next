const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student"); // Assuming you have a Student model

// Register a new student
const registerStudent = async (req, res) => {
    const { student_name, student_email, student_password, student_id, enrollment_year } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(student_password, 10);
        const newStudent = new Student({
            student_name,
            student_email,
            student_password: hashedPassword,
            student_id,
            enrollment_year,
        });
        await newStudent.save();
        res.status(201).json({ message: "Student registered successfully" });
    } catch (error) {
        console.error("Error registering student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Login student
const loginStudent = async (req, res) => {
    const { student_email, student_password } = req.body;

    try {
        const student = await Student.findOne({ student_email });
        if (!student) {
            return res.status(401).json({ message: "Can't find student with this email" });
        }

        const isMatch = await bcrypt.compare(student_password, student.student_password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        // res.json({ token });
        res.json({
            token,
            student: {
                _id: student._id,
                student_name: student.student_name,
                student_id: student.student_id,
                student_email: student.student_email,
                enrollment_year: student.enrollment_year,
            },
        });
    } catch (error) {
        console.error("Error logging in student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { registerStudent, loginStudent };
