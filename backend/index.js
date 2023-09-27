const connectDatabase = require('./config/database');
const express = require('express');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

connectDatabase();

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const app = express();
let cors = require("cors");
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
  })
);

// Middleware
app.use(express.json());

// mounting routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});