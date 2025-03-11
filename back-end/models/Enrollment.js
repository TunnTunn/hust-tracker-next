const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
    {
        student_id: {
            type: String,
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        semester: {
            type: String,
            required: true,
        },
        midterm_grade: {
            type: Number,
            min: 0,
            max: 10,
            default: null,
        },
        final_grade: {
            type: Number,
            min: 0,
            max: 10,
            default: null,
        },
        gpa_scale: {
            type: Number,
            min: 0,
            max: 4,
            default: null,
        },
        character_grade: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Helper method to calculate weighted grade
EnrollmentSchema.methods.calculateWeightedGrade = function () {
    return this.final_grade * this.course.final_weight + this.midterm_grade * (1 - this.course.final_weight);
};

// Method to calculate GPA scale from grades
EnrollmentSchema.methods.calculateGPAScale = function () {
    const grade = this.calculateWeightedGrade();

    // If we couldn't calculate the weighted grade, return null
    if (grade === null) return null;

    if (grade >= 9.5) return 4.0;
    if (grade >= 8.5) return 3.7;
    if (grade >= 8.0) return 3.5;
    if (grade >= 7.0) return 3.0;
    if (grade >= 6.5) return 2.5;
    if (grade >= 5.5) return 2.0;
    if (grade >= 5.0) return 1.5;
    if (grade >= 4.0) return 1.0;
    return 0.0;
};

// Helper function to get character grade from final grade
EnrollmentSchema.methods.getCharacterGrade = function () {
    const grade = this.calculateWeightedGrade();

    // If we couldn't calculate the weighted grade, return null
    if (grade === null) return null;

    if (grade >= 9.0) return "A+";
    if (grade >= 8.5) return "A";
    if (grade >= 8.0) return "B+";
    if (grade >= 7.0) return "B";
    if (grade >= 6.5) return "C+";
    if (grade >= 5.5) return "C";
    if (grade >= 5.0) return "D+";
    if (grade >= 4.0) return "D";
    return "F";
};

// Pre-save middleware to auto-calculate GPA scale
EnrollmentSchema.pre("save", async function (next) {
    try {
        // Populate the course
        if (this.course && typeof this.course === "object" && !this.course.final_weight) {
            await this.populate("course");
        }

        // Calculate GPA scale
        this.gpa_scale = this.calculateGPAScale();

        // Calculate character grade
        this.character_grade = this.getCharacterGrade();
        next();
    } catch (error) {
        console.error("Error in pre-save middleware:", error);
        next(error);
    }
});

const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

module.exports = Enrollment;
