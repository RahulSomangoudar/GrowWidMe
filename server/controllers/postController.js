const Post = require('../models/Post');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = new Post({
      title,
      content,
      createdBy: userId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Create Post Error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Get all posts (or only user’s posts if logged in)
const getPosts = async (req, res) => {
  try {
    let posts;
    if (req.user) {
      // Return only current user's posts if logged in
      posts = await Post.find({ createdBy: req.user.id }).populate('createdBy', 'username');
    } else {
      // Otherwise return all public posts
      posts = await Post.find().populate('createdBy', 'username');
    }

    res.json(posts);
  } catch (err) {
    console.error('Get Posts Error:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error('Update Post Error:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });

    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Delete Post Error:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// Search posts
const searchPosts = async (req, res) => {
  const query = req.query.q;
  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ]
    }).populate('createdBy', 'username');

    res.json(posts);
  } catch (err) {
    console.error('Search Posts Error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
};

// 👇 Export all functions
module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  searchPosts
};
