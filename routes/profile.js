const router = require('express').Router();

/**
 * @route  GET /profile
 * @desc   Test route
 * @access PUBLIC
 **/

router.get('/', (req, res) => res.send('profile route'));

module.exports = router;
