const express = require("express");
const chatCtrl = require("../Controllers/chatControllers");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, chatCtrl.accessChat);
router.route("/").get(protect, chatCtrl.fetchChats);
router.route("/createGroup").post(protect, chatCtrl.createGroupChat);
router.route("/fetchGroups").get(protect, chatCtrl.fetchGroups);
router.route("/groupExit").put(protect, chatCtrl.groupExit);

module.exports = router;