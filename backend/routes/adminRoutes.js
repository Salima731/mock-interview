const express = require("express");
const { userAuthorization, userAuthentication } = require("../middlewares/auth");
const { getAllUsers, updateUserRole, updateUserStatus, userRemove, getAllEvents, deleteEvent, getDashboardStats, getUserStats, getEventStats } = require("../controllers/adminController");
const router = express.Router();



router.route("/users/all").get(userAuthentication, userAuthorization("admin"), getAllUsers);
router.route("/user/role/:id").patch(userAuthentication, userAuthorization("admin"), updateUserRole);
router.route("/user/status/:id").patch(userAuthentication, userAuthorization("admin"), updateUserStatus);
router.route("/user/:id").delete(userAuthentication, userAuthorization("admin"), userRemove);
router.route("/events/all").get(userAuthentication, userAuthorization("admin"), getAllEvents);
router.route("/event/:id").delete(userAuthentication, userAuthorization("admin"), deleteEvent);
router.route("/user-stats").get(userAuthentication, userAuthorization("admin"), getUserStats);
router.route("/event-stats").get(userAuthentication, userAuthorization("admin"), getEventStats);







module.exports = router;