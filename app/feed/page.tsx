"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.data.user);
          }
        })
        .catch(err => console.error(err));
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
    if (!user) {
      router.push('/auth');
      return;
    }
    if (!content.trim()) return;
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
      } else {
        alert(data.message || 'Failed to create post');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return alert('Please login to like');
    try {
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
      fetchPosts();
    }
  };

  const submitComment = async (postId: string, commentContent: string) => {
    if (!user) return alert('Please login to comment');
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

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('xtrafunding_user');
    router.push('/auth');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getDashboardPath = () => {
    if (user?.role === 'STARTUP') return '/startup/dashboard';
    return '/investor/dashboard';
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Just now' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.container}>
      {/* PREMIUM HEADER */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#F5A623"/>
            <path d="M2 16.5L12 22L22 16.5V11L12 16.5L2 11V16.5Z" fill="#F5A623"/>
          </svg>
          XtraFunds
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Home
          </Link>
          <Link href="/feed" className={`${styles.navLink} ${styles.navLinkActive}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
            Feed
          </Link>
          <Link href="/campaign" className={styles.navLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Campaigns
          </Link>
          <Link href={getDashboardPath()} className={styles.navLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </Link>
        </div>

        {/* USER SECTION */}
        <div className={styles.navRight}>
          {user ? (
            <div className={styles.userMenu}>
              <button className={styles.userBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className={styles.navAvatar}>{getInitials(user.name)}</div>
                <span className={styles.navUserName}>{user.name}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div className={styles.dropdownBackdrop} onClick={() => setDropdownOpen(false)} />
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>{getInitials(user.name)}</div>
                      <div>
                        <div className={styles.dropdownName}>{user.name}</div>
                        <div className={styles.dropdownRole}>{user.role}</div>
                      </div>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link href={getDashboardPath()} className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                      My Dashboard
                    </Link>
                    {user.role === 'STARTUP' && (
                      <Link href="/startup/posts" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        My Posts
                      </Link>
                    )}
                    <Link href={`/profile/${user._id}`} className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      View Profile
                    </Link>
                    <div className={styles.dropdownDivider} />
                    <button className={styles.dropdownLogout} onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth" className={styles.loginBtn}>Sign In</Link>
          )}
        </div>
      </nav>

      <div className={styles.feedWrapper}>
        {/* LEFT SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarProfile}>
              <div className={styles.sidebarAvatar}>{user ? getInitials(user.name) : '?'}</div>
              <div className={styles.sidebarProfileName}>{user?.name || 'Guest'}</div>
              <div className={styles.sidebarProfileRole}>{user?.role || 'Visitor'}</div>
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>Quick Links</div>
            <nav className={styles.sidebarNav}>
              <Link href={getDashboardPath()} className={styles.sidebarLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Dashboard
              </Link>
              <Link href="/campaign" className={styles.sidebarLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Explore Startups
              </Link>
              {user?.role === 'STARTUP' && (
                <Link href="/startup/posts" className={styles.sidebarLink}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Manage Posts
                </Link>
              )}
              {user?.role === 'INVESTOR' && (
                <Link href="/investor/investments" className={styles.sidebarLink}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  My Investments
                </Link>
              )}
              <Link href="/xraise" className={styles.sidebarLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
                XRaise Offers
              </Link>
            </nav>
          </div>
        </aside>

        {/* MAIN FEED */}
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
                <Link href={`/profile/${post.author?._id || post.author}`} className={styles.postHeader}>
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
                  {user && (
                    <div className={styles.commentForm}>
                      <input 
                        type="text" 
                        placeholder="Type a comment and press Enter..."
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

        {/* RIGHT SIDEBAR */}
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
