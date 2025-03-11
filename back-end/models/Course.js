const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
    {
        course_code: { type: String, unique: true, required: true },
        course_name: {
            en: { type: String, required: true },
            vi: { type: String, required: true },
        },
        course_credit: { type: Number, required: true },
        final_weight: { type: Number, required: true, min: 0, max: 1 },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation error in development
const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

module.exports = Course;
