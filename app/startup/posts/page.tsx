"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { toast } from 'sonner';

export default function StartupPostsManagement() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchSelf = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const res = await fetch(`/api/users/${userId}`);
          const data = await res.json();
          if (data.success) {
            setUser(data.data.user);
            setPosts(data.data.posts);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };

    fetchSelf();
  }, []);

  const submitComment = async (postId: string, commentContent: string) => {
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, content: commentContent })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => p._id === postId ? { ...p, comments: data.data } : p));
      }
    } catch (err) {
      console.error(err);
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Just now' : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className={styles.loader}>Loading posts...</div>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Community Posts</h1>
      
      <div className={styles.createPost}>
        <div className={styles.composeHeader}>Create a new update</div>
        <textarea 
          className={styles.composeInput} 
          placeholder="Share your latest milestones, funding news, or product updates with the investor community..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className={styles.composeFooter}>
          <input 
            type="file" 
            accept="image/*,video/*,application/pdf"
            onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
            className={styles.imgInput}
          />
          <button 
            className={styles.btnPost} 
            disabled={!content.trim() || isPosting}
            onClick={handlePost}
          >
            {isPosting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </div>

      <div className={styles.feedList}>
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No posts published yet</h3>
            <p>Your timeline is empty. Publish an update to let investors track your progress!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <div className={styles.postDate}>{formatDate(post.createdAt)}</div>
              </div>
              
              <div className={styles.postContent}>{post.content}</div>
              
              {post.imageUrl && (
                <img src={post.imageUrl} alt="Attachment" className={styles.postImage} />
              )}
              
              <div className={styles.postActions}>
                <div className={styles.actionStat}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {post.likes.length} Likes
                </div>
                <div className={styles.actionStat}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  {post.comments?.length || 0} Comments
                </div>
              </div>

              {/* COMMENTS SECTION */}
              <div className={styles.commentsSection}>
                {post.comments?.map((comment: any, idx: number) => (
                  <div key={idx} className={styles.commentItem}>
                    <span className={styles.commentAuthor}>{comment.author?.name || 'User'}</span>
                    <span className={styles.commentText}>{comment.content}</span>
                  </div>
                ))}
                {user && (
                  <div className={styles.commentForm}>
                    <input 
                      type="text" 
                      placeholder="Reply to this update..."
                      className={styles.commentInput}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                           submitComment(post._id, e.currentTarget.value);
                           e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
