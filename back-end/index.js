const express = require("express");
const cors = require("cors");

const app = express();

const dotenv = require("dotenv");
dotenv.config();

// Connect to MongoDB
const { dbConnect } = require("./configs/dbConnect");
dbConnect();

// Middleware Cross-Origin Resource Sharing
app.use(cors());

// Middleware JSON body parser
app.use(express.json());

// Routes init
const route = require("./routes/index-route");
route(app);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
