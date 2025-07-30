const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter your username"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "Email already exist"],
        lowercase: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [5, "Password must be at least 5 characters long"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    status: {
        type: String,
        enum: ["active", "suspended"],
        default: "active"
    },
    profilePhoto: {
        type: String,
        default: ""
    }
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next;
    try {
        this.password = await bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT_ROUND));
        next();
    } catch (err) {
        next(err);
    }   
});

const User = mongoose.model("User", userSchema);

module.exports = User;