"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    // Load active user from localStorage (simulating auth state)
    const storedUser = localStorage.getItem('xtrafunding_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Mock user if not logged in just for demo purposes
      setUser({
        _id: '64d2f8a8b1a3e5c9f0e1b2c3', // Fake ObjectId
        name: 'Demo Startup',
        role: 'STARTUP'
      });
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!content.trim() || !user) return;
    setIsPosting(true);
    try {
      const formData = new FormData();
      formData.append('authorId', user._id);
      formData.append('content', content);
      if (mediaFile) {
        formData.append('media', mediaFile);
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.data, ...posts]);
        setContent('');
        setMediaFile(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return alert('Please login to like');
    try {
      // Optistic update
      setPosts(posts.map(p => {
        if (p._id === postId) {
          const hasLiked = p.likes.includes(user._id);
          return {
            ...p,
            likes: hasLiked ? p.likes.filter((id: string) => id !== user._id) : [...p.likes, user._id]
          };
        }
        return p;
      }));

      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });
    } catch (err) {
      console.error(err);
      fetchPosts(); // Revert on failure
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Just now' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#F5A623"/>
            <path d="M2 16.5L12 22L22 16.5V11L12 16.5L2 11V16.5Z" fill="#F5A623"/>
          </svg>
          XtraFunds
        </Link>
        <div className={styles.navLinks}>
          <Link href="/feed" className={styles.navLink} style={{color: '#1B3A6B'}}>Feed</Link>
          <Link href="/campaign" className={styles.navLink}>Campaigns</Link>
        </div>
      </nav>

      <div className={styles.feedWrapper}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>Your Profile</div>
            <div className={styles.authorName}>{user?.name || 'Guest'}</div>
            <div className={styles.authorMeta}>{user?.role || 'Visitor'}</div>
          </div>
        </aside>

        <main className={styles.mainFeed}>
          {user?.role !== 'INVESTOR' && (
            <div className={styles.createPost}>
              <div className={styles.composeHeader}>Share an update</div>
              <textarea 
                className={styles.composeInput} 
                placeholder="What's new with your startup?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className={styles.composeFooter}>
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
                  className={styles.imgInput}
                  title="Upload Image/Video"
                />
                <button 
                  className={styles.btnPost} 
                  disabled={!content.trim() || isPosting}
                  onClick={handlePost}
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className={styles.loader}>Loading feed...</div>
          ) : (
            posts.map(post => (
              <div key={post._id} className={styles.postCard}>
                <Link href={`/startup/${post.author?._id || post.author}`} className={styles.postHeader}>
                  <div className={styles.avatar}>
                    {post.author?.name ? post.author.name.charAt(0) : 'U'}
                  </div>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>{post.author?.name || 'Unknown Author'}</div>
                    <div className={styles.authorMeta}>
                      {post.author?.startupDetails?.sector || post.author?.role} • {formatDate(post.createdAt)}
                    </div>
                  </div>
                </Link>
                
                <div className={styles.postContent}>{post.content}</div>
                
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="Post attachment" className={styles.postImage} />
                )}
                
                <div className={styles.postActions}>
                  <button 
                    className={`${styles.btnAction} ${post.likes.includes(user?._id) ? styles.liked : ''}`}
                    onClick={() => toggleLike(post._id)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={post.likes.includes(user?._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {post.likes.length} Likes
                  </button>
                </div>
              </div>
            ))
          )}
        </main>

        <aside className={styles.trending}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>Trending Startups</div>
            <Link href="#" className={styles.trendingItem}>
              <div className={styles.trendTag}>FinTech • Seed</div>
              <div className={styles.trendName}>Nexus Protocol</div>
            </Link>
            <Link href="#" className={styles.trendingItem}>
              <div className={styles.trendTag}>AI • Series A</div>
              <div className={styles.trendName}>OmniMind AI</div>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
