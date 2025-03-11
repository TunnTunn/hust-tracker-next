const Enrollment = require("../models/Enrollment");

// Get all enrollments and stats for a student
const getEnrollmentsByStudent = async (req, res) => {
    try {
        const { student_id } = req.params;
        const { stats } = req.query; // Add a query parameter to optionally include stats

        // Find all enrollments for the student and populate course data
        const enrollments = await Enrollment.find({ student_id }).populate("course").sort({ semester: -1 }); // Sort by semester in descending order

        // If stats are not requested, just return the enrollments
        if (stats !== "true") {
            return res.status(200).json(enrollments);
        }

        // Calculate GPA and credits for enrollments with final grades
        const enrollmentsWithGrades = enrollments.filter((e) => e.final_grade !== null);

        if (enrollmentsWithGrades.length === 0) {
            return res.status(200).json({
                enrollments,
                stats: {
                    totalCredits: 0,
                    gpa: 0,
                },
            });
        }

        // Calculate GPA and credits
        let totalGradePoints = 0;
        let totalCredits = 0;

        enrollmentsWithGrades.forEach((enrollment) => {
            const credits = enrollment.course.course_credit || 0;
            totalCredits += credits;
            totalGradePoints += enrollment.gpa_scale * credits;
        });

        const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

        res.status(200).json({
            enrollments,
            stats: {
                totalCredits,
                gpa: parseFloat(gpa.toFixed(2)),
            },
        });
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a specific enrollment
const getEnrollmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await Enrollment.findById(id).populate("course");

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        res.status(200).json(enrollment);
    } catch (error) {
        console.error("Error fetching enrollment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a new enrollment
const createEnrollment = async (req, res) => {
    try {
        const { student_id, course, semester, midterm_grade, final_grade } = req.body;

        // Create new enrollment
        const newEnrollment = new Enrollment({
            student_id,
            course,
            semester,
            midterm_grade,
            final_grade,
        });

        // Save the enrollment
        const savedEnrollment = await newEnrollment.save();

        // Populate the course field for the response
        const populatedEnrollment = await Enrollment.findById(savedEnrollment._id).populate("course");

        res.status(201).json(populatedEnrollment);
    } catch (error) {
        console.error("Error creating enrollment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update an enrollment
const updateEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const { midterm_grade, final_grade } = req.body;

        // Find the enrollment
        const enrollment = await Enrollment.findById(id);

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        // Update fields
        if (midterm_grade !== undefined) enrollment.midterm_grade = midterm_grade;
        if (final_grade !== undefined) enrollment.final_grade = final_grade;

        // Save the updated enrollment
        const updatedEnrollment = await enrollment.save();

        // Populate the course field for the response
        const populatedEnrollment = await Enrollment.findById(updatedEnrollment._id).populate("course");

        res.status(200).json(populatedEnrollment);
    } catch (error) {
        console.error("Error updating enrollment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete an enrollment
const deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await Enrollment.findByIdAndDelete(id);

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        res.status(200).json({ message: "Enrollment deleted successfully" });
    } catch (error) {
        console.error("Error deleting enrollment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getEnrollmentsByStudent,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
};
