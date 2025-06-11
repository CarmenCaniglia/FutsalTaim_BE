const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");
const authenticate = require("../middlewares/auth");

router.get("/", teamController.getAllTeams);
router.post("/", authenticate, teamController.createTeam);
router.get("/:id", teamController.getTeamById);
router.put("/:id", authenticate, teamController.updateTeam);
router.delete("/:id", authenticate, teamController.deleteTeam);

module.exports = router;
