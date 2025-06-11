import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to GrowWidMe</h1>
        <p>Share your thoughts, ideas, and Achievements with the world</p>
        <div className="cta-buttons">
          <Link to="/create" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </section>

      <section className="features-section">
        <div className="feature">
          <h3>Create Posts</h3>
          <p>Share your thoughts and ideas with our community</p>
        </div>
        <div className="feature">
          <h3>Engage</h3>
          <p>Connect with other writers and readers</p>
        </div>
        <div className="feature">
          <h3>Discover</h3>
          <p>Find interesting content and new perspectives</p>
        </div>
      </section>

      <section className="posts-section">
        <h2>Latest Posts</h2>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="posts-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div key={post.id} className="post-card">
                <h3>{post.title}</h3>
                <p className="post-date">{formatDate(post.createdAt)}</p>
                <p className="post-content">{post.content}</p>
                <Link to={`/post/${post.id}`} className="read-more">Read More</Link>
              </div>
            ))
          ) : (
            <div className="no-posts">
              <p>No posts found. Be the first to create one!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 