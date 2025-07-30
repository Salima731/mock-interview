const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(cors({
    origin: true,  //two different ports access
    credentials: true   //<-- CRITICAL: allow cookies
})); 




const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const eventRouter = require("./routes/eventRoutes");


app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/events", eventRouter);


app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {  // Multer-specific errors
        return res.status(400).json({ success: false, message: err.message });
    } else if (err) {

        return res.status(500).json({ success: false, message: err.message });        // General errors
    }
    next();
});


module.exports = app;