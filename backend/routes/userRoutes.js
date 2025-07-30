const express = require("express");
const { userRegister, userLogin, userLogout, getUserProfile, updateUserProfile, updatePassword } = require("../controllers/userController");
const createUpload = require("../middlewares/fileUpload");
const { userAuthentication } = require("../middlewares/auth");
const router = express.Router();
const upload = createUpload("users");


router.route("/register").post(upload.single("profilePhoto"), userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post( userLogout);
router.route("/profile").get(userAuthentication, getUserProfile);
router.route("/profile-update").put(userAuthentication, upload.single("profilePhoto") , updateUserProfile);
router.route("/update-password").put(userAuthentication, updatePassword);







module.exports = router;