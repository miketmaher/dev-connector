const router = require('express').Router();

/**
 * @route  GET /posts
 * @desc   Test route
 * @access PUBLIC
 **/

router.get('/', (req, res) => res.send('posts route'));

module.exports = router;
