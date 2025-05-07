const express = require("express");
const authController = require("../controllers/auth.controllers");
const userController = require("../controllers/user.controllers");

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", userController.registerUser);

module.exports = router;
