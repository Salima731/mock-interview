const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const deleteImages = require("../utils/deleteImages");



// exports.userRegister = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         console.log("req.bodyyy", req.body);
        
//         const profilePhoto = req.file ? `uploads/users/${req.file.filename}` : '';

//         if (!username || !email || !password) {
//             if (profilePhoto) await deleteImages(profilePhoto);
//             return res.status(400).json({
//                 success: false,
//                 message: "Please enter all data"
//             })
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             if (profilePhoto) await deleteImages(profilePhoto);
//             return res.status(409).json({  //409 (Conflict) such as duplicate email registration.
//                 success: false,
//                 message: "Email is already registered."
//             })
//         }

//         const newUser = new User({
//             username,
//             email,
//             password,
//             profilePhoto
//         });

//         const user = await newUser.save();

//         return res.status(201).json({
//             success: true,
//             message: "User registered successfully.",
//             user
//         })
//     } catch (error) {
//         if (req.file) await deleteImages(`uploads/users/${req.file.filename}`);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

exports.userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("req.bodyyy", req.body);

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all data"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({  //409 (Conflict) such as duplicate email registration.
                success: false,
                message: "Email is already registered."
            });
        }

        const newUser = new User({
            username,
            email,
            password
        });

        const user = await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all data"
            })
        }

        const user = await User.findOne({ email }).select("+password"); //can access the hashed password to verify credentials
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

         if(user.status === "suspended") {
                return res.status(403).json({
                    success: false,
                    message: "Your account is inactive. Please contact support."
                })
            }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Inavalid credentials"
            })
        }

        const option = {
            id: user._id,
            role: user.role,
            email: user.email
        };

        const tokenValue = jwt.sign(option, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        const { password: _, ...userData } = user.toObject(); //Remove the password field from the user object before sending 

        return res.status(200).cookie("token", tokenValue).json({
            success: true,
            message: "Login successful.",
            user: userData
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.userLogout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,  //Prevents client-side JavaScript from accessing the cookie
            expires: new Date(0), //// Expire immediately
            sameSite: "strict",   //Prevents the cookie from being sent in cross-site requests,
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select("-password"); // exclude password
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// exports.updateUserProfile = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const { username, email } = req.body;
//         const newProfilePhoto = req.file ? `uploads/users/${req.file.filename}` : '';

//         const user = await User.findById(userId);
//         if (!user) {
//             if (newProfilePhoto) await deleteImages(newProfilePhoto);
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found."
//             });
//         }

//         //Prevents multiple users from registering or updating to the same email address.
//         if (email && email !== user.email) {    // Check if email is being updated and ensure uniqueness
//             const emailExists = await User.findOne({ email });
//             if (emailExists) {
//                 if (newProfilePhoto) await deleteImages(newProfilePhoto);
//                 return res.status(409).json({
//                     success: false,
//                     message: "Email already in use."
//                 });
//             }
//         }

//         if (newProfilePhoto) {  //// Replace profile photo if a new one is uploaded
//             if (user.profilePhoto) {
//                 await deleteImages(user.profilePhoto)
//             }
//             user.profilePhoto = newProfilePhoto
//         }

//         if (username) user.username = username;
//         if (email) user.email = email;

//         const updatedUser = await user.save();
//         const { password, ...userData } = updatedUser.toObject(); //Even though the password is hashed, it should never be returned to the frontend

//         return res.status(200).json({
//             success: true,
//             message: "Profile updated successfully.",
//             user: userData
//         })
//     } catch (error) {
//         if (req.file) await deleteImages(`uploads/users/${req.file.filename}`);
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, email } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Prevent multiple users from using the same email address
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use."
                });
            }
        }

        if (username) user.username = username;
        if (email) user.email = email;

        const updatedUser = await user.save();
        const { password, ...userData } = updatedUser.toObject(); // Remove password from response

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: userData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current and new passwords are required."
            })
        }
  if (newPassword.length < 5) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long."
            })
        }


        const user = await User.findById(userId).select("+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            })
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from the current password."
            })
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
