const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

/**
 * @route  GET /auth
 * @desc   Test route
 * @access PRIVATE
 **/
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
