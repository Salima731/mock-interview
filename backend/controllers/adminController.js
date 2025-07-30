const Event = require("../models/eventModel");
const User = require("../models/userModel");
const deleteImages = require("../utils/deleteImages");



exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        if (!users.length) {
            return res.status(404).json({
                success: false,
                message: "Users not found"
            })
        }

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log("statusss", status);

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.status = status;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User status updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                status: user.status
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

 exports.userRemove = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.profilePhoto) {
            await deleteImages(user.profilePhoto);
        }

        await user.deleteOne();

        return res.status(200).json({
            success: true,
            message: "User removed successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('createdBy', 'username email')
            .sort({ date: 1 });  //// Sort by upcoming events first
        if (!events || events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No events found."
            })
        }

        return res.status(200).json({
            success: true,
            count: events.length,
            events
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }

        await event.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully.",
            event: {
                id: event._id,
                title: event.title,
                createdBy: event.createdBy
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const pastYear = new Date();
        pastYear.setFullYear(pastYear.getFullYear() - 1);

        const usersGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: pastYear } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalUsers,
            usersGrowth
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getEventStats = async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();

        const pastYear = new Date();
        pastYear.setFullYear(pastYear.getFullYear() - 1);

        const eventsGrowth = await Event.aggregate([
            { $match: { createdAt: { $gte: pastYear } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalEvents,
            eventsGrowth
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};