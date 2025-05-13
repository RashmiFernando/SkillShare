import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile';
import AuthScreen from './pages/AuthScreen';
import api from './axiosConfig';

function App() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(null); // Store user profile data
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];

  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    mediaUrls: [],
    category: '',
    postedBy: '',
    createdAt: today,
  });

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }
      const response = await api.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data.reverse());
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response?.status === 401) {
        navigate('/auth');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e, index) => {
    const updatedUrls = [...newPost.mediaUrls];
    updatedUrls[index] = e.target.value;
    setNewPost((prev) => ({ ...prev, mediaUrls: updatedUrls }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('description', newPost.description);
      formData.append('category', newPost.category);
      formData.append('postedBy', newPost.postedBy);
      formData.append('createdAt', newPost.createdAt);

      const mediaFiles = document.getElementById('mediaFiles').files;
      for (let i = 0; i < mediaFiles.length; i++) {
        formData.append('mediaFiles', mediaFiles[i]);
      }

      await axios.post('http://localhost:8081/api/posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setShowForm(false);
      setNewPost({
        title: '',
        description: '',
        mediaUrls: [],
        category: '',
        postedBy: '',
        createdAt: today,
      });
      fetchPosts();
      toast.success('✅ Post Created Successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('❌ Failed to create post');
    }
  };

  const openEditPost = (post) => {
    setSelectedPost(post);
    setEditMode(true);
    setImagePreview(post.mediaUrls ? post.mediaUrls[0] : null);
  };

  const closeEdit = () => {
    setSelectedPost(null);
    setEditMode(false);
    setImagePreview(null);
  };

  const deletePost = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeEdit();
      fetchPosts();
      toast.success('🗑 Post Deleted Successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('❌ Failed to delete post');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setShowProfileMenu(false);
    toast.success('👋 Logged out successfully!');
    navigate('/auth');
  };

  const saveEditedPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', selectedPost.title);
      formData.append('description', selectedPost.description);
      formData.append('category', selectedPost.category);
      formData.append('postedBy', selectedPost.postedBy);
      formData.append('createdAt', selectedPost.createdAt);

      const mediaFiles = document.getElementById('mediaFiles').files;
      for (let i = 0; i < mediaFiles.length; i++) {
        formData.append('mediaFiles', mediaFiles[i]);
      }

      await axios.put(`http://localhost:8081/api/posts/${selectedPost.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      closeEdit();
      fetchPosts();
      toast.success('✅ Post Updated Successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('❌ Failed to update post');
    }
  };

  const handleSelectedPostChange = (e) => {
    const { name, value } = e.target;
    setSelectedPost((prev) => ({ ...prev, [name]: value }));
  };

  const likePost = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8081/api/posts/${id}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
      toast.success('❤️ Liked!');
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('❌ Failed to like');
    }
  };

  const addComment = async (id, comment) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8081/api/posts/${id}/comment`, comment, {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPosts();
      toast.success('💬 Comment Added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('❌ Failed to add comment');
    }
  };

  const deleteComment = async (postId, commentIndex) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/posts/${postId}/comment/${commentIndex}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
      toast.success('🗑️ Comment Deleted!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('❌ Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="app-wrapper">
      <ToastContainer position="top-center" autoClose={1500} />
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              <div className="header">
                <h1 className="app-title">Talento</h1>

                <div className="header-actions">
                  <div className="header-buttons">
                    <button
                      className="tutorials-button"
                      onClick={() => window.location.href = 'http://localhost:3000/tutorials'}
                    >
                      View Tutorials
                    </button>

                    <div className="profile-container" ref={menuRef}>
                      <img
                        src={user?.profileImageUrl || 'https://via.placeholder.com/40'}
                        alt="Profile"
                        className="profile-icon"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                      />
                      {showProfileMenu && (
                        <div className="profile-menu">
                          <button
                            className="profile-menu-item"
                            onClick={() => {
                              setShowProfileMenu(false);
                              navigate('/profile');
                            }}
                          >
                            View Profile
                          </button>
                          <button
                            className="profile-menu-item logout"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
              <div className="content-wrapper">
                {posts.length === 0 ? (
                  <p className="no-posts">No posts available yet.</p>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="post-card">
                      <div className="post-header">
                        <div className="avatar">{post.postedBy?.charAt(0)}</div>
                        <div>
                          <p className="posted-by">{post.postedBy}</p>
                          <p className="post-date">{post.createdAt ? formatDate(post.createdAt) : 'Invalid Date'}</p>
                        </div>
                        <div className="edit-icon" onClick={() => openEditPost(post)}>✏️</div>
                      </div>
                      <h2 className="post-title">{post.title}</h2>
                      <p className="post-description">{post.description}</p>
                      <p className="post-category">Category: {post.category || 'Uncategorized'}</p>

                      {post.mediaUrls && post.mediaUrls.map((url, index) => {
                        const fileUrl = `http://localhost:8081${url}`;
                        const isVideo = fileUrl.endsWith('.mp4') || fileUrl.endsWith('.mov') || fileUrl.endsWith('.webm');
                        return isVideo ? (
                          <video key={index} controls className="post-media">
                            <source src={fileUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img key={index} src={fileUrl} alt={`Post Media ${index + 1}`} className="post-image" />
                        );
                      })}

                      <button className={`like-button ${post.likes > 0 ? 'liked' : ''}`} onClick={() => likePost(post.id)}>
                        ❤️ {post.likes || 0} Likes
                      </button>

                      <div className="comments-section">
                        <h4>Comments</h4>
                        {post.comments?.map((comment, index) => (
                          <p key={index} className="comment">
                            {comment}
                            <span className="delete-comment-icon" onClick={() => deleteComment(post.id, index)}>🗑️</span>
                          </p>
                        ))}
                        <AddCommentForm postId={post.id} addComment={addComment} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button className="floating-button" onClick={() => setShowForm(true)}>+</button>

              {showForm && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h2 className="modal-title">Create New Post</h2>
                    <form onSubmit={handleSubmit} className="form">
                      <input type="text" name="title" placeholder="Title" value={newPost.title} onChange={handleInputChange} required />
                      <textarea name="description" placeholder="Description" value={newPost.description} onChange={handleInputChange} required />
                      {[0, 1, 2].map((i) => (
                        <input key={i} type="text" placeholder={`Media URL ${i + 1}`} value={newPost.mediaUrls[i] || ''} onChange={(e) => handleMediaChange(e, i)} />
                      ))}
                      <input type="file" id="mediaFiles" multiple onChange={handleFileChange} required />
                      <select name="category" value={newPost.category} onChange={handleInputChange} required>
                        <option value="" disabled>Select Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Education">Education</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Business">Business</option>
                        <option value="Travel">Travel</option>
                      </select>
                      <input type="text" name="postedBy" placeholder="Posted By" value={newPost.postedBy} onChange={handleInputChange} required />
                      <input type="date" name="createdAt" value={newPost.createdAt} onChange={handleInputChange} required />
                      <div className="form-buttons">
                        <button type="submit" className="btn-primary">Submit</button>
                        <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {editMode && selectedPost && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h2 className="modal-title">Edit Post</h2>
                    <form className="form" onSubmit={(e) => { e.preventDefault(); saveEditedPost(); }}>
                      <input type="text" name="title" value={selectedPost.title} onChange={handleSelectedPostChange} required />
                      <textarea name="description" value={selectedPost.description} onChange={handleSelectedPostChange} required />
                      {imagePreview && <img src={imagePreview} alt="Preview" className="post-image" />}
                      <input type="file" id="mediaFiles" onChange={handleFileChange} />
                      <select name="category" value={selectedPost.category} onChange={handleSelectedPostChange} required>
                        <option value="" disabled>Select Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Education">Education</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Business">Business</option>
                        <option value="Travel">Travel</option>
                      </select>
                      <input type="text" name="postedBy" value={selectedPost.postedBy} onChange={handleSelectedPostChange} required />
                      <input type="date" name="createdAt" value={selectedPost.createdAt} onChange={handleSelectedPostChange} required />
                      <div className="form-buttons">
                        <button type="submit" className="btn-primary">Save</button>
                        <button type="button" onClick={() => deletePost(selectedPost.id)} className="btn-danger">Delete</button>
                        <button type="button" onClick={closeEdit} className="btn-secondary">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<AuthScreen />} />
      </Routes>
    </div>
  );
}

function AddCommentForm({ postId, addComment }) {
  const [comment, setComment] = useState('');

  const submitComment = async (e) => {
    e.preventDefault();
    if (comment.trim() === '') return;
    await addComment(postId, comment);
    setComment('');
  };

  return (
    <form onSubmit={submitComment} className="add-comment-form">
      <input type="text" placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
      <button type="submit" className="btn-primary">Post</button>
    </form>
  );
}

export default App;