const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
    {
        student_name: {
            type: String,
            required: true,
        },
        student_email: {
            type: String,
            required: true,
            unique: true,
        },
        student_password: {
            type: String,
            required: true,
        },
        student_id: {
            type: String,
            required: true,
            unique: true,
        },
        enrollment_year: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Method to compare password
StudentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.student_password);
};

const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);
module.exports = Student;
