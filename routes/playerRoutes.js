const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const authenticate = require('../middlewares/auth')

router.get('/', playerController.getAllPlayers);
router.post('/',authenticate, playerController.createPlayer);
router.put('/:id', authenticate, playerController.updatePlayer);
router.delete('/:id', authenticate, playerController.deletePlayer);
router.get('/topscorers', playerController.getTopScorers);

module.exports = router;
