const express = require("express");
const router = express.Router();
const {
  createUser
} = require("../controllers/userController");
// Auth routes
router.post("/signup", createUser);

module.exports = router;
