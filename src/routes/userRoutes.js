const express = require("express");
const router = express.Router();
const {
  createUser,
  VerifyOtp
} = require("../controllers/userController");
// Auth routes
router.post("/register", createUser);
router.post("/verify", VerifyOtp);

module.exports = router;
