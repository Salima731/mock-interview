const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Event title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters long"]
    },
    description: {
        type: String,
        required: [true, "Event description is required"],
        minlength: [10, "Description must be at least 10 characters long"]
    },
    category: {
        type: String,
        required: [true, "Event category is required"],
        enum: ['Conference', 'Workshop', 'Webinar', 'Meetup', 'Seminar', 'Other']
    },
    location: {
        type: String,
        required: [true, "Event location is required"],
        trim: true
    },
    startDateTime: {
        type: Date,
        required: [true, "Event start date and time is required"]
    },
    endDateTime: {
        type: Date,
        required: [true, "Event end date and time is required"]
    },
    organizerName: {
        type: String,
        required: [true, "Organizer name is required"],
        trim: true
    },
    organizerContact: {
        type: String,
        required: [true, "Organizer contact is required"],
        trim: true
    },
    maxParticipants: {
        type: Number,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;