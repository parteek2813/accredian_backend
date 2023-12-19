const express = require("express");
const router = express.Router();

const {userSignup, userlogin} = require("../controller/userController");

router.post("/signup",userSignup);
router.post("/login",userlogin);

module.exports = router;