const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { organizarIA } = require("../controllers/iaController");

router.post("/organizar", authMiddleware, organizarIA);

module.exports = router;
