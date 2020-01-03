const router = require('express').Router();

/**
 * @route  GET /auth
 * @desc   Test route
 * @access PUBLIC
 **/

router.get('/', (req, res) => res.send('auth route'));

module.exports = router;
