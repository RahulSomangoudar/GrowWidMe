import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post, onDelete, showActions = true }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit/${post.id}`);
  };

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      {showActions && (
        <div className="post-actions">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={() => onDelete(post.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
