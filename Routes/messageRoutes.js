const express = require("express");
const msgCtrl = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, msgCtrl.allMessages);
router.route("/").post(protect, msgCtrl.sendMessage);

module.exports = router;