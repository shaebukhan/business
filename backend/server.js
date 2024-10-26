const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
//auth routes
const authRoutes = require("./routes/authRoute");
//category routes 
const categoryRoutes = require("./routes/categoryRoutes");
//acounts routes
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const entryRoutes = require("./routes/entryRoutes");

const cors = require("cors");
// Config
dotenv.config();
// Database config
connectDB();
// Middlewares 
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/transaction", transactionRoutes);
app.use("/api/v1/entry", entryRoutes);

// REST API
app.get("/", (req, res) => {
    res.send('<h1>Welcome to MYGAL App</h1>');
});
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});
