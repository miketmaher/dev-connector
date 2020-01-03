const router = require('express').Router();

/**
 * @route  GET /users
 * @desc   Test route
 * @access PUBLIC
 **/

router.get('/', (req, res) => res.send('users route'));

module.exports = router;
