const express = require('express');
const router = express.Router();
const classificaController = require('../controllers/classificaController');

router.get('/squadre', classificaController.getTeamStandings);
router.get('/marcatori', classificaController.getTopScorers);

module.exports = router;
