"use client";

import React, { useState, useEffect, use } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function StartupProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('xtrafunding_user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    
    fetchProfileData();
  }, [resolvedParams.id]);

  const fetchProfileData = async () => {
    try {
      const res = await fetch(`/api/users/${resolvedParams.id}`);
      const data = await res.json();
      if (data.success) {
        setProfile(data.data.user);
        setPosts(data.data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!currentUser) return alert('Please login to like');
    try {
      setPosts(posts.map(p => {
        if (p._id === postId) {
          const hasLiked = p.likes.includes(currentUser._id);
          return {
            ...p,
            likes: hasLiked ? p.likes.filter((id: string) => id !== currentUser._id) : [...p.likes, currentUser._id]
          };
        }
        return p;
      }));

      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id })
      });
    } catch (err) {
      console.error(err);
      fetchProfileData();
    }
  };

  const submitComment = async (postId: string, commentContent: string) => {
    if (!currentUser) return alert('Please login to comment');
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id, content: commentContent })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => p._id === postId ? { ...p, comments: data.data } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) return <div className={styles.container}><div className={styles.loader}>Loading Profile...</div></div>;
  if (!profile) return <div className={styles.container}><div className={styles.loader}>Startup Not Found</div></div>;

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
          <Link href="/feed" className={styles.navLink}>Feed</Link>
          <Link href="/campaign" className={styles.navLink}>Campaigns</Link>
        </div>
      </nav>

      <div className={styles.contentWrapper}>
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.profileAvatar}>
              {profile.name.charAt(0)}
            </div>
            <h1 className={styles.profileName}>{profile.name}</h1>
            <div className={styles.profileRole}>{profile.role}</div>
            
            <div className={styles.profileDetailList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Company</span>
                <span className={styles.detailValue}>{profile.startupDetails?.companyName || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Sector</span>
                <span className={styles.detailValue}>{profile.startupDetails?.sector || 'Technology'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>{profile.startupDetails?.location || 'Global'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Joined</span>
                <span className={styles.detailValue}>{formatDate(profile.createdAt)}</span>
              </div>
            </div>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <h2 className={styles.sectionTitle}>Recent Updates</h2>
          
          {posts.length === 0 ? (
            <div className={styles.emptyState}>No updates posted by this startup yet.</div>
          ) : (
            posts.map(post => (
              <div key={post._id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <div className={styles.avatarSmall}>
                    {profile.name.charAt(0)}
                  </div>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>{profile.name}</div>
                    <div className={styles.authorMeta}>{formatDate(post.createdAt)}</div>
                  </div>
                </div>
                
                <div className={styles.postContent}>{post.content}</div>
                
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="Post attachment" className={styles.postImage} />
                )}
                
                <div className={styles.postActions}>
                  <button 
                    className={`${styles.btnAction} ${post.likes.includes(currentUser?._id) ? styles.liked : ''}`}
                    onClick={() => toggleLike(post._id)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={post.likes.includes(currentUser?._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {post.likes.length} Likes
                  </button>
                  <div className={styles.btnAction} style={{cursor: 'default'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
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
                  {currentUser && (
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
        </main>
      </div>
    </div>
  );
}
