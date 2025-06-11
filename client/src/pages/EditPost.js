import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { toast } from 'react-toastify';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!auth.currentUser) {
        toast.error('You must be logged in to edit a post');
        navigate('/login');
        return;
      }

      try {
        const postRef = doc(db, 'posts', id);
        const postDoc = await getDoc(postRef);
        
        if (postDoc.exists()) {
          const post = postDoc.data();
          if (post.uid !== auth.currentUser.uid) {
            toast.error('You can only edit your own posts');
            navigate('/posts');
            return;
          }
          setTitle(post.title);
          setContent(post.content);
        } else {
          toast.error('Post not found');
          navigate('/posts');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to fetch post');
        navigate('/posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date()
      });
      
      toast.success('Post updated successfully!');
      navigate('/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-section">
        <h2>Edit Post</h2>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter post title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Enter post content"
            rows="6"
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/posts')}>Cancel</button>
          <button type="submit">Update Post</button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
