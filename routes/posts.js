const router = require('express').Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const Profile = require('../models/Profile');

/**
 * @route  POST /posts
 * @desc   create a post
 * @access PRIVATE
 **/

router.post(
  '/',
  [
    auth,
    check('text', 'Text is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const { name, avatar } = user;
      const newPost = new Post({
        text: req.body.text,
        user: req.user.id,
        name,
        avatar,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    }
  },
);

/**
 * @route  GET /posts
 * @desc   get all posts
 * @access PRIVATE
 **/

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
});

/**
 * @route  GET /posts/:id
 * @desc   get post by id
 * @access PRIVATE
 **/

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Internal server error');
  }
});

/**
 * @route  DELETE /posts/:id
 * @desc   delete post
 * @access PRIVATE
 **/

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ msg: 'Post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Internal server error');
  }
});

/**
 * @route  PUT /posts/like/:id
 * @desc   add a like to a post
 * @access PRIVATE
 **/

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ msg: 'Post not found' });
    }

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Internal server error');
  }
});

/**
 * @route  PUT /posts/unlike/:id
 * @desc   add a unlike to a post
 * @access PRIVATE
 **/

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ msg: 'Post not found' });
    }

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not been liked' });
    }
    const index = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(index, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
