// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.blog-post, .about-text, .hero-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // Enhanced CTA tracking (for analytics purposes)
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // You can add analytics tracking here
            console.log('CTA clicked:', this.textContent);
        });
    });
    
    // Reading time estimation
    function calculateReadingTime() {
        const postContent = document.querySelector('.post-content');
        if (postContent) {
            const text = postContent.textContent;
            const wordCount = text.split(' ').length;
            const readingTime = Math.ceil(wordCount / 200); // Average reading speed
            
            const readingTimeElement = document.createElement('div');
            readingTimeElement.className = 'reading-time';
            readingTimeElement.innerHTML = `<span>📖 ${readingTime} min read</span>`;
            
            const postMeta = document.querySelector('.post-meta');
            if (postMeta) {
                postMeta.appendChild(readingTimeElement);
            }
        }
    }
    
    calculateReadingTime();
    
    // Add CSS for reading time
    const style = document.createElement('style');
    style.textContent = `
        .reading-time {
            margin-left: auto;
            color: #666;
            font-size: 0.9rem;
        }
        
        .reading-time span {
            background: #f0f0f0;
            padding: 5px 10px;
            border-radius: 15px;
        }
        
        @media (max-width: 768px) {
            .post-meta {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            
            .reading-time {
                margin-left: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    // Update button state
    updateThemeButton(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Update theme
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update button
            updateThemeButton(newTheme);
            
            // Add smooth transition
            html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                html.style.transition = '';
            }, 300);
        });
    }
}

function updateThemeButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

// Initialize theme toggle
initThemeToggle();

// Comments System
let comments = JSON.parse(localStorage.getItem('blogComments')) || {};

function postComment(postId) {
    const nameInput = document.getElementById(`commentName-${postId.replace('-post', '')}`);
    const textInput = document.getElementById(`commentText-${postId.replace('-post', '')}`);
    const anonymousToggle = document.getElementById(`anonymousToggle-${postId.replace('-post', '')}`);
    
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    const isAnonymous = anonymousToggle.checked;
    
    // Validation
    if (!text) {
        alert('Please enter a comment.');
        return;
    }
    
    if (!isAnonymous && !name) {
        alert('Please enter your name or check "Post anonymously".');
        return;
    }
    
    // Create comment object
    const comment = {
        id: Date.now(),
        author: isAnonymous ? 'Anonymous' : (name || 'Anonymous'),
        content: text,
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        timestamp: Date.now()
    };
    
    // Add to comments array
    if (!comments[postId]) {
        comments[postId] = [];
    }
    comments[postId].unshift(comment); // Add to beginning
    
    // Save to localStorage
    localStorage.setItem('blogComments', JSON.stringify(comments));
    
    // Clear form
    nameInput.value = '';
    textInput.value = '';
    anonymousToggle.checked = false;
    
    // Refresh comments display
    displayComments(postId);
    
    // Show success message
    showCommentSuccess();
}

function displayComments(postId) {
    const commentsList = document.getElementById(`commentsList-${postId.replace('-post', '')}`);
    if (!commentsList) return;
    
    const postComments = comments[postId] || [];
    
    if (postComments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to share your thoughts!</div>';
        return;
    }
    
    commentsList.innerHTML = postComments.map(comment => `
        <div class="comment" data-comment-id="${comment.id}">
            <div class="comment-header">
                <span class="comment-author">${escapeHtml(comment.author)}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-content">${escapeHtml(comment.content)}</div>
            <div class="comment-actions">
                <button class="comment-action" onclick="likeComment('${postId}', ${comment.id})">
                    👍 Like
                </button>
                <button class="comment-action" onclick="replyToComment('${postId}', ${comment.id})">
                    💬 Reply
                </button>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showCommentSuccess() {
    // Create success message
    const successMsg = document.createElement('div');
    successMsg.className = 'comment-success';
    successMsg.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
        ">
            ✅ Comment posted successfully!
        </div>
    `;
    
    document.body.appendChild(successMsg);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

function likeComment(postId, commentId) {
    // Simple like functionality - could be enhanced with actual like tracking
    const comment = comments[postId]?.find(c => c.id === commentId);
    if (comment) {
        if (!comment.likes) comment.likes = 0;
        comment.likes++;
        localStorage.setItem('blogComments', JSON.stringify(comments));
        
        // Update the like button
        const likeBtn = event.target;
        likeBtn.textContent = `👍 Liked (${comment.likes})`;
        likeBtn.style.color = '#4CAF50';
    }
}

function replyToComment(postId, commentId) {
    // Simple reply functionality - could be enhanced with nested replies
    const replyText = prompt('Enter your reply:');
    if (replyText && replyText.trim()) {
        const originalComment = comments[postId]?.find(c => c.id === commentId);
        if (originalComment) {
            const reply = {
                id: Date.now(),
                author: 'Anonymous',
                content: `@${originalComment.author}: ${replyText.trim()}`,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                timestamp: Date.now(),
                isReply: true
            };
            
            if (!comments[postId]) {
                comments[postId] = [];
            }
            comments[postId].unshift(reply);
            localStorage.setItem('blogComments', JSON.stringify(comments));
            displayComments(postId);
        }
    }
}

// Load comments when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize comments for all posts
    const postIds = ['monero-post', 'darkweb-post', 'bitcoin-post', 'revolution-post', 'fingerprints-post', 'forensics-post', 'obfuscation-post', 'lazarus-post', 'stuxnet-post', 'decentralization-post'];
    
    postIds.forEach(postId => {
        displayComments(postId);
    });
    
    // Add keyboard shortcuts for all comment forms
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to post comment
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const commentTexts = document.querySelectorAll('textarea[id^="commentText-"]');
            commentTexts.forEach(textarea => {
                if (document.activeElement === textarea) {
                    const postId = textarea.id.replace('commentText-', '') + '-post';
                    postComment(postId);
                }
            });
        }
    });
});

// Add CSS for success message animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Lazy loading for images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
} 