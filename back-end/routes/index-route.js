const authRouter = require("./auth-route");
const coursesRouter = require("./courses-route");
// const semestersRouter = require("./semesters-route");
const studentRoute = require("./student-route");
const enrollmentRouter = require("./enrollment-route");

module.exports = (app) => {
    app.use("/api/auth", authRouter);
    app.use("/api/courses", coursesRouter);
    app.use("/api/enrollments", enrollmentRouter);
    app.use("/api/students", studentRoute);
};
