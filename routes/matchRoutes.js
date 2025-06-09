const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authenticate = require('../middlewares/auth');

router.get('/', matchController.getAllMatches);
router.post('/', authenticate, matchController.createMatch);
router.put('/:id', authenticate, matchController.updateMatch);
router.delete('/:id', authenticate, matchController.deleteMatch);
router.post('/knockout', authenticate, matchController.createKnockoutMatch);


module.exports = router;
