const express = require("express");
const router = express.Router();

router.get("/", require("../controllers/indexController"));
router.get("/register", (req, res) => {
  res.render("register");
});
module.exports = router;
