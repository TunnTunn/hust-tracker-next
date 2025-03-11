const express = require("express");
const { registerStudent, loginStudent } = require("../controllers/auth-controller");

const router = express.Router();

// Register a new student
router.post("/register", registerStudent);

// Login student
router.post("/login", loginStudent);

module.exports = router;
