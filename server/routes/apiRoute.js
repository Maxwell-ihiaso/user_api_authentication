const express = require("express");
const { verifyAccessToken } = require("../auth/jwtHelper");
const router = express.Router();
const {
  registerHandler,
  loginHandler,
  dashboardHandler,
  refreshHandler,
  logoutHandler,
} = require("../controllers/apiController");

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/dashboard", verifyAccessToken, dashboardHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", verifyAccessToken, logoutHandler);

module.exports = router;
