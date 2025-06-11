const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  searchPosts
} = require('../controllers/postController');

router.get('/', authMiddleware, getPosts); // => /api/posts
router.post('/', authMiddleware, createPost); // => /api/posts
router.put('/:id', authMiddleware, updatePost); // => /api/posts/123
router.delete('/:id', authMiddleware, deletePost); // => /api/posts/123
router.get('/search', searchPosts); // => /api/posts/search?q=...


module.exports = router;
