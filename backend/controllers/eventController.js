const Event = require("../models/eventModel");
const User = require("../models/userModel");
const deleteImages = require("../utils/deleteImages");


exports.createEvent = async (req, res) => {
    try {
        const userId = req.userId;
        const { title,
            description,
            category,
            location,
            startDateTime,
            endDateTime,
            maxParticipants } = req.body;

        const image = req.file ? `uploads/events/${req.file.filename}` : '';

        if (!title || !description || !category || !location || !startDateTime || !endDateTime) {
            if (image) await deleteImages(image);
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided."
            });
        }

        if (new Date(startDateTime) >= new Date(endDateTime)) {
            if (image) await deleteImages(image);
            return res.status(400).json({
                success: false,
                message: "Start date and time must be before end date and time."
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            if (image) await deleteImages(image);
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const createEvent = new Event({
            title,
            description,
            category,
            location,
            startDateTime,
            endDateTime,
            maxParticipants: maxParticipants || null,
            createdBy: userId,
            organizerName: user.username,
            organizerContact: user.email,
            image

        })
        console.log("createeeEve", createEvent);

        const savedEvent = await createEvent.save();

        return res.status(201).json({
            success: true,
            message: "Event created successfully.",
            event: savedEvent
        })
    } catch (error) {
        if (req.file) {
            await deleteImages(`uploads/events/${req.file.filename}`);
        }
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getUserEvents = async (req, res) => {
    try {
        const userId = req.userId;

        const userEvents = await Event.find({ createdBy: userId })
            .populate('createdBy', 'username email')  //Populates creator info
            .sort({ date: 1 })  // Sort by date ascending (upcoming first)

        if (!userEvents || userEvents.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No events found for this user."
            });
        }

        return res.status(200).json({
            success: true,
            count: userEvents.length,
            events: userEvents
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateOwnEvent = async (req, res) => {
    try {
        const userId = req.userId;
        const eventId = req.params.id;
        const updates = req.body;
        const newImage = req.file ? `uploads/events/${req.file.filename}` : null;
        console.log("newwww", newImage);

        const event = await Event.findById(eventId);
        if (!event) {
            if (newImage) await deleteImages(newImage);
            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }

        if (event.createdBy.toString() !== userId) {
            if (newImage) await deleteImages(newImage);
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this event."
            });
        }

        // Update fields if provided
        const fieldsToUpdate = [
            "title",
            "description",
            "category",
            "location",
            "startDateTime",
            "endDateTime",
            "maxParticipants"
        ];

        fieldsToUpdate.forEach(field => {
            if (updates[field] !== undefined) {
                event[field] = updates[field];
            }
        });

        // Validate date range if both dates are provided
        if (event.startDateTime && event.endDateTime) {
            if (new Date(event.startDateTime) >= new Date(event.endDateTime)) {
                if (newImage) await deleteImages(newImage);
                return res.status(400).json({
                    success: false,
                    message: "Start date and time must be before end date and time."
                });
            }
        }

        // If there's a new image, replace the old one
        if (newImage) {
            if (event.image) {
                await deleteImages(event.image);
            }
            event.image = newImage;
        }

        const updatedEvent = await event.save();

        return res.status(200).json({
            success: true,
            message: "Event updated successfully.",
            event: updatedEvent
        });

    } catch (error) {
        if (req.file) {
            await deleteImages(`uploads/events/${req.file.filename}`);
        }
        return res.status(500).json({
            success: false,
            message: "Failed to update event.",
            error: error.message
        });
    }
};

exports.deleteOwnEvent = async (req, res) => {
    try {
        const userId = req.userId;
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }

        if (event.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this event."
            });
        }

        await event.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully.",
            event: {
                id: event._id,
                title: event.title,
                date: event.date,
                location: event.location
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAllPublicEvents = async (req, res) => {
    try {
        const {
            category,
            location,
            search,
            startDate,
            endDate,
            sortBy = 'startDateTime',
            order = 'asc',
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (category) filter.category = category;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
        if (startDate || endDate) {
            filter.startDateTime = {};
            if (startDate) filter.startDateTime.$gte = new Date(startDate);
            if (endDate) filter.startDateTime.$lte = new Date(endDate);
        }

        const sortOrder = order === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        const events = await Event.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('createdBy', 'username email');

        const totalEvents = await Event.countDocuments(filter);
        const totalPages = Math.ceil(totalEvents / limit);

        return res.status(200).json({
            success: true,
            count: events.length,
            totalEvents,
            totalPages,
            currentPage: Number(page),
            events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


