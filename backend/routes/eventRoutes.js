const express = require("express");
const createUpload = require("../middlewares/fileUpload");
const { userAuthentication } = require("../middlewares/auth");
const { createEvent, updateOwnEvent, getUserEvents, deleteOwnEvent, getAllPublicEvents } = require("../controllers/eventController");
const router = express.Router();
const upload = createUpload("events");

router.route("/create-event").post(userAuthentication, upload.single("image"), createEvent);
router.route("/user").get(userAuthentication, getUserEvents);
router.route("/updateEvent/:id").put(userAuthentication, upload.single("image"), updateOwnEvent);
router.route("/deleteEvent/:id").delete(userAuthentication, deleteOwnEvent);
router.route("/all").get( getAllPublicEvents);




module.exports = router;