/**
 * Web Experiments Lab - Main JavaScript
 * インタラクティブな要素とアニメーションを管理
 */

// DOMContentLoaded Event
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initStatsCounter();
    initScrollReveal();
    initCardAnimations();
    addEasterEggs();
});

/**
 * 統計カウンターアニメーション
 */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

/**
 * カウンターアニメーション
 */
function animateCounter(element) {
    const target = element.getAttribute('data-count');
    
    // 無限大記号の場合
    if (target === '∞') {
        let count = 0;
        const interval = setInterval(() => {
            count += 10;
            element.textContent = count;
            if (count >= 100) {
                element.textContent = '∞';
                clearInterval(interval);
            }
        }, 30);
        return;
    }

    const targetNumber = parseInt(target);
    const duration = 2000; // 2秒
    const steps = 60;
    const increment = targetNumber / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
        current += increment;
        step++;
        element.textContent = Math.floor(current);

        if (step >= steps) {
            element.textContent = targetNumber;
            clearInterval(timer);
        }
    }, duration / steps);
}

/**
 * スクロール時の要素表示アニメーション
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.project-card, .intro-section, .stats-section');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal', 'active');
                }, index * 100); // 順次表示
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });
}

/**
 * カードのマウス追従効果
 */
function initCardAnimations() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/**
 * 背景のパーティクルアニメーション
 */
function initAnimations() {
    createParticles();
}

function createParticles() {
    const bgAnimation = document.querySelector('.background-animation');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(99, 102, 241, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particle-float ${Math.random() * 20 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        bgAnimation.appendChild(particle);
    }
    
    // パーティクルアニメーションのCSSを動的に追加
    if (!document.querySelector('#particle-animation-style')) {
        const style = document.createElement('style');
        style.id = 'particle-animation-style';
        style.textContent = `
            @keyframes particle-float {
                0%, 100% {
                    transform: translate(0, 0);
                    opacity: 0;
                }
                10%, 90% {
                    opacity: 1;
                }
                50% {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * イースターエッグ機能
 */
function addEasterEggs() {
    // Konamiコマンド (↑↑↓↓←→←→BA)
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiPattern.join(',')) {
            activateSecretMode();
        }
    });
    
    // ロゴをダブルクリックで特別なメッセージ
    const logo = document.querySelector('.logo');
    let clickCount = 0;
    let clickTimer = null;
    
    logo.addEventListener('click', () => {
        clickCount++;
        
        if (clickTimer) clearTimeout(clickTimer);
        
        if (clickCount === 3) {
            showSecretMessage();
            clickCount = 0;
        }
        
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 500);
    });
}

/**
 * シークレットモード発動
 */
function activateSecretMode() {
    const body = document.body;
    body.style.animation = 'rainbow 3s infinite';
    
    // レインボーアニメーションを追加
    if (!document.querySelector('#rainbow-animation-style')) {
        const style = document.createElement('style');
        style.id = 'rainbow-animation-style';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    showNotification('🎉 秘密のモードが発動しました！', 'success');
    
    setTimeout(() => {
        body.style.animation = '';
    }, 3000);
}

/**
 * 秘密のメッセージ表示
 */
function showSecretMessage() {
    const messages = [
        '🧪 実験は成功です！',
        '🎮 遊び心を忘れずに！',
        '💡 好奇心が未来を作る',
        '🚀 コードで世界を変えよう',
        '🎨 創造力に限界はない',
        '⚡ バグも楽しめ！'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showNotification(randomMessage, 'info');
}

/**
 * 通知表示関数
 */
function showNotification(message, type = 'info') {
    // 既存の通知を削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
        font-weight: 600;
        font-size: 1rem;
    `;
    
    // アニメーションスタイルを追加
    if (!document.querySelector('#notification-animation-style')) {
        const style = document.createElement('style');
        style.id = 'notification-animation-style';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * スムーススクロール
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

/**
 * パフォーマンス監視（開発用）
 */
if (window.performance && console.time) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`🚀 Page loaded in ${loadTime}ms`);
    });
}

/**
 * マウスカーソル効果
 */
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid rgba(99, 102, 241, 0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
}

// デスクトップの場合のみカーソル効果を有効化
if (window.innerWidth > 768) {
    initCursorEffect();
}

// ウィンドウリサイズ時の対応
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        console.log('Window resized');
        // 必要に応じてレイアウトを再計算
    }, 250);
});

console.log('🧪 Web Experiments Lab initialized!');
console.log('💡 Try clicking the logo 3 times or use the Konami code!');
