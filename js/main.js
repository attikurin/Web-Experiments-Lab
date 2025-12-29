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
    
    // 隠しコマンド用の入力バッファ
    let keyBuffer = [];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        keyBuffer.push(e.key.toLowerCase());
        keyBuffer = keyBuffer.slice(-10);
        const bufferString = keyBuffer.join('');
        
        // 1. Konamiコマンド - レインボーモード
        if (konamiCode.join(',') === konamiPattern.join(',')) {
            activateSecretMode();
        }
        
        // 2. 「magic」入力 - 魔法陣召喚
        if (bufferString.includes('magic')) {
            activateMagicCircle();
            keyBuffer = [];
        }
        
        // 3. 「snow」入力 - 雪降らし
        if (bufferString.includes('snow')) {
            activateSnowfall();
            keyBuffer = [];
        }
        
        // 4. 「star」入力 - 流れ星
        if (bufferString.includes('star')) {
            activateShootingStars();
            keyBuffer = [];
        }
        
        // 5. 「party」入力 - パーティーモード
        if (bufferString.includes('party')) {
            activatePartyMode();
            keyBuffer = [];
        }
        
        // 6. 「neko」入力 - かわいい猫
        if (bufferString.includes('neko')) {
            activateCatMode();
            keyBuffer = [];
        }
        
        // 7. 「destroy」入力 - 破壊の呪文
        if (bufferString.includes('destroy')) {
            activateDestroyMode();
            keyBuffer = [];
        }
        
        // 8. 「explosion」入力 - 大爆発
        if (bufferString.includes('explosion')) {
            activateExplosion();
            keyBuffer = [];
        }
        
        // 9. 「help」入力 - ヒント表示
        if (bufferString.includes('help')) {
            showCommandHelp();
            keyBuffer = [];
        }
        
        // 10. 「hint」入力 - ヒント表示（別名）
        if (bufferString.includes('hint')) {
            showCommandHelp();
            keyBuffer = [];
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
 * 隠しコマンド1: 魔法陣召喚 (magic)
 */
function activateMagicCircle() {
    showNotification('✨ 魔法陣が召喚されました！', 'success');
    
    const magicCircle = document.createElement('div');
    magicCircle.className = 'magic-circle';
    magicCircle.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 400px;
        border: 3px solid #ffd700;
        border-radius: 50%;
        box-shadow: 0 0 60px #ffd700, inset 0 0 60px #ffd700;
        z-index: 9998;
        animation: magicRotate 4s linear, magicFadeOut 4s ease;
        pointer-events: none;
    `;
    
    // 内側の円を追加
    for (let i = 0; i < 3; i++) {
        const innerCircle = document.createElement('div');
        const size = 350 - (i * 50);
        innerCircle.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${size}px;
            height: ${size}px;
            border: 2px solid #ffd700;
            border-radius: 50%;
            opacity: ${0.7 - (i * 0.2)};
        `;
        magicCircle.appendChild(innerCircle);
    }
    
    // 星型の装飾を追加
    for (let i = 0; i < 8; i++) {
        const star = document.createElement('div');
        const angle = (i * 45) * (Math.PI / 180);
        const x = Math.cos(angle) * 180;
        const y = Math.sin(angle) * 180;
        star.innerHTML = '⭐';
        star.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px));
            font-size: 24px;
            animation: starPulse 0.5s infinite alternate;
            animation-delay: ${i * 0.1}s;
        `;
        magicCircle.appendChild(star);
    }
    
    document.body.appendChild(magicCircle);
    
    // アニメーションスタイルを追加
    if (!document.querySelector('#magic-circle-style')) {
        const style = document.createElement('style');
        style.id = 'magic-circle-style';
        style.textContent = `
            @keyframes magicRotate {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes magicFadeOut {
                0%, 70% { opacity: 1; }
                100% { opacity: 0; }
            }
            @keyframes starPulse {
                from { transform: scale(1); filter: brightness(1); }
                to { transform: scale(1.3); filter: brightness(2); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => magicCircle.remove(), 4000);
}

/**
 * 隠しコマンド2: 雪降らし (snow)
 */
function activateSnowfall() {
    showNotification('❄️ 雪が降ってきました！', 'success');
    
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    snowContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9997;
    `;
    
    // 雪の結晶を50個生成
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        const size = Math.random() * 20 + 10;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 5 + 5;
        
        snowflake.innerHTML = '❄️';
        snowflake.style.cssText = `
            position: absolute;
            left: ${left}%;
            top: -50px;
            font-size: ${size}px;
            opacity: ${Math.random() * 0.6 + 0.4};
            animation: snowfall ${duration}s linear ${delay}s;
        `;
        snowContainer.appendChild(snowflake);
    }
    
    document.body.appendChild(snowContainer);
    
    if (!document.querySelector('#snowfall-style')) {
        const style = document.createElement('style');
        style.id = 'snowfall-style';
        style.textContent = `
            @keyframes snowfall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => snowContainer.remove(), 10000);
}

/**
 * 隠しコマンド3: 流れ星 (star)
 */
function activateShootingStars() {
    showNotification('🌠 流れ星が現れました！', 'success');
    
    const shootStars = () => {
        const star = document.createElement('div');
        const startY = Math.random() * 50;
        const startX = Math.random() * 100;
        
        star.style.cssText = `
            position: fixed;
            left: ${startX}%;
            top: ${startY}%;
            width: 3px;
            height: 3px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 10px 2px white;
            z-index: 9997;
            pointer-events: none;
            animation: shootingStar 1.5s ease-out;
        `;
        
        // 尾を追加
        const tail = document.createElement('div');
        tail.style.cssText = `
            position: absolute;
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, white, transparent);
            right: 3px;
            top: 50%;
            transform: translateY(-50%);
        `;
        star.appendChild(tail);
        
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1500);
    };
    
    if (!document.querySelector('#shooting-star-style')) {
        const style = document.createElement('style');
        style.id = 'shooting-star-style';
        style.textContent = `
            @keyframes shootingStar {
                to {
                    transform: translate(500px, 500px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 10個の流れ星を順次表示
    for (let i = 0; i < 10; i++) {
        setTimeout(shootStars, i * 300);
    }
}

/**
 * 隠しコマンド4: パーティーモード (party)
 */
function activatePartyMode() {
    showNotification('🎉 パーティータイム！', 'success');
    
    const colors = ['#ff0080', '#00ff80', '#0080ff', '#ff8000', '#8000ff', '#ffff00'];
    let interval;
    let count = 0;
    
    // 背景を点滅させる
    interval = setInterval(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.style.backgroundColor = randomColor;
        document.body.style.transition = 'background-color 0.3s';
        
        // 紙吹雪を発射
        createConfetti();
        
        count++;
        if (count >= 20) {
            clearInterval(interval);
            document.body.style.backgroundColor = '';
        }
    }, 200);
    
    // 音符を浮かべる
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const note = document.createElement('div');
            const notes = ['♪', '♫', '♬', '♩'];
            note.innerHTML = notes[Math.floor(Math.random() * notes.length)];
            note.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                bottom: -50px;
                font-size: ${Math.random() * 40 + 30}px;
                color: ${colors[Math.floor(Math.random() * colors.length)]};
                z-index: 9997;
                pointer-events: none;
                animation: floatUp 3s ease-out;
            `;
            document.body.appendChild(note);
            setTimeout(() => note.remove(), 3000);
        }, i * 200);
    }
    
    if (!document.querySelector('#party-style')) {
        const style = document.createElement('style');
        style.id = 'party-style';
        style.textContent = `
            @keyframes floatUp {
                to {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * 紙吹雪を生成
 */
function createConfetti() {
    const colors = ['#ff0080', '#00ff80', '#0080ff', '#ff8000', '#8000ff', '#ffff00'];
    
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            top: -10px;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            z-index: 9997;
            pointer-events: none;
            animation: confettiFall ${Math.random() * 2 + 2}s ease-out;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
    
    if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(${Math.random() * 720}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * 隠しコマンド5: かわいい猫モード (neko)
 */
function activateCatMode() {
    showNotification('🐱 にゃーん！猫が遊びにきたよ！', 'success');
    
    const cat = document.createElement('div');
    cat.innerHTML = '🐱';
    cat.style.cssText = `
        position: fixed;
        font-size: 60px;
        z-index: 9998;
        cursor: pointer;
        transition: transform 0.3s ease;
        animation: catWalk 8s linear infinite;
    `;
    
    // 猫をクリックすると反応
    let meowCount = 0;
    cat.addEventListener('click', () => {
        meowCount++;
        const meows = ['にゃー！', 'にゃあ♪', 'ごろごろ...', 'にゃんにゃん！', 'みゃー！'];
        const meow = document.createElement('div');
        meow.textContent = meows[Math.floor(Math.random() * meows.length)];
        meow.style.cssText = `
            position: fixed;
            left: ${cat.offsetLeft + 30}px;
            top: ${cat.offsetTop - 30}px;
            background: rgba(255, 192, 203, 0.9);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: bold;
            z-index: 9999;
            pointer-events: none;
            animation: fadeUpOut 2s ease;
        `;
        document.body.appendChild(meow);
        setTimeout(() => meow.remove(), 2000);
        
        // 5回クリックで特別な反応
        if (meowCount === 5) {
            cat.style.animation = 'catSpin 1s ease';
            setTimeout(() => {
                cat.style.animation = 'catWalk 8s linear infinite';
            }, 1000);
            showNotification('🐱💕 猫があなたになついた！', 'success');
            meowCount = 0;
        }
    });
    
    // ハートを生成
    const createHeart = () => {
        const heart = document.createElement('div');
        heart.innerHTML = '💗';
        heart.style.cssText = `
            position: fixed;
            left: ${cat.offsetLeft + 20}px;
            top: ${cat.offsetTop}px;
            font-size: 20px;
            z-index: 9997;
            pointer-events: none;
            animation: heartFloat 2s ease-out;
        `;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    };
    
    document.body.appendChild(cat);
    
    // 2秒ごとにハートを出す
    const heartInterval = setInterval(createHeart, 2000);
    
    if (!document.querySelector('#cat-style')) {
        const style = document.createElement('style');
        style.id = 'cat-style';
        style.textContent = `
            @keyframes catWalk {
                0% {
                    left: -100px;
                    top: 50%;
                    transform: scaleX(1);
                }
                48% {
                    left: calc(50% - 30px);
                    top: 50%;
                    transform: scaleX(1);
                }
                52% {
                    left: calc(50% - 30px);
                    top: 50%;
                    transform: scaleX(-1);
                }
                100% {
                    left: calc(100% + 100px);
                    top: 50%;
                    transform: scaleX(-1);
                }
            }
            @keyframes catSpin {
                from { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.5); }
                to { transform: rotate(360deg) scale(1); }
            }
            @keyframes heartFloat {
                to {
                    transform: translateY(-100px);
                    opacity: 0;
                }
            }
            @keyframes fadeUpOut {
                to {
                    transform: translateY(-30px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 8秒後に猫を削除
    setTimeout(() => {
        cat.remove();
        clearInterval(heartInterval);
    }, 8000);
}

/**
 * 隠しコマンド6: 破壊の呪文 (destroy)
 */
function activateDestroyMode() {
    showNotification('💥 破壊の呪文が発動！', 'success');
    
    // 画面全体を赤く点滅
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: red;
        z-index: 9998;
        pointer-events: none;
        animation: redFlash 0.1s ease-in-out 5;
    `;
    document.body.appendChild(overlay);
    
    // カメラシェイク
    document.body.style.animation = 'earthquake 0.5s ease-in-out 3';
    
    // プロジェクトカードを破壊
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            // クラック（ひび割れ）エフェクト
            card.style.position = 'relative';
            const crack = document.createElement('div');
            crack.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    linear-gradient(45deg, transparent 48%, #ff0000 49%, #ff0000 51%, transparent 52%),
                    linear-gradient(-45deg, transparent 48%, #ff0000 49%, #ff0000 51%, transparent 52%),
                    linear-gradient(135deg, transparent 48%, #ff0000 49%, #ff0000 51%, transparent 52%);
                z-index: 10;
                pointer-events: none;
                animation: crackAppear 0.3s ease-out;
            `;
            card.appendChild(crack);
            
            // カードが砕け散る
            setTimeout(() => {
                card.style.animation = 'cardShatter 0.8s ease-out';
                
                // 破片を生成
                for (let i = 0; i < 15; i++) {
                    const fragment = document.createElement('div');
                    const size = Math.random() * 30 + 10;
                    fragment.style.cssText = `
                        position: fixed;
                        left: ${card.offsetLeft + Math.random() * card.offsetWidth}px;
                        top: ${card.offsetTop + Math.random() * card.offsetHeight}px;
                        width: ${size}px;
                        height: ${size}px;
                        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                        z-index: 9999;
                        pointer-events: none;
                        animation: fragmentFly 1s ease-out;
                        transform: rotate(${Math.random() * 360}deg);
                    `;
                    document.body.appendChild(fragment);
                    setTimeout(() => fragment.remove(), 1000);
                }
            }, 300);
        }, index * 150);
    });
    
    // 爆発音を視覚的に表現
    setTimeout(() => {
        const boom = document.createElement('div');
        boom.innerHTML = '💥';
        boom.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 200px;
            z-index: 10000;
            pointer-events: none;
            animation: boomEffect 1s ease-out;
        `;
        document.body.appendChild(boom);
        setTimeout(() => boom.remove(), 1000);
    }, 1000);
    
    if (!document.querySelector('#destroy-style')) {
        const style = document.createElement('style');
        style.id = 'destroy-style';
        style.textContent = `
            @keyframes redFlash {
                0%, 100% { opacity: 0; }
                50% { opacity: 0.5; }
            }
            @keyframes earthquake {
                0%, 100% { transform: translate(0, 0); }
                10% { transform: translate(-10px, -10px); }
                20% { transform: translate(10px, 10px); }
                30% { transform: translate(-10px, 10px); }
                40% { transform: translate(10px, -10px); }
                50% { transform: translate(-10px, -10px); }
                60% { transform: translate(10px, 10px); }
                70% { transform: translate(-10px, 10px); }
                80% { transform: translate(10px, -10px); }
                90% { transform: translate(-5px, 5px); }
            }
            @keyframes crackAppear {
                from {
                    opacity: 0;
                    transform: scale(0);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            @keyframes cardShatter {
                0% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.5;
                    transform: scale(1.1) rotate(5deg);
                }
                100% {
                    opacity: 0;
                    transform: scale(0.5) rotate(-5deg);
                }
            }
            @keyframes fragmentFly {
                to {
                    transform: translate(
                        ${Math.random() * 400 - 200}px,
                        ${Math.random() * 400 + 200}px
                    ) rotate(${Math.random() * 720}deg);
                    opacity: 0;
                }
            }
            @keyframes boomEffect {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.5);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(3);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 3秒後に復元
    setTimeout(() => {
        overlay.remove();
        document.body.style.animation = '';
        cards.forEach(card => {
            card.style.animation = '';
            card.style.opacity = '1';
            const crack = card.querySelector('div[style*="crackAppear"]');
            if (crack) crack.remove();
        });
        showNotification('✨ 復元しました！', 'success');
    }, 3000);
}

/**
 * 隠しコマンド7: 大爆発 (explosion)
 */
function activateExplosion() {
    showNotification('💣 大爆発が起こります...3...2...1...', 'success');
    
    setTimeout(() => {
        // 中心から爆発の衝撃波
        const shockwave = document.createElement('div');
        shockwave.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            border: 5px solid #ff4500;
            border-radius: 50%;
            z-index: 10000;
            pointer-events: none;
            animation: shockwaveExpand 2s ease-out;
        `;
        document.body.appendChild(shockwave);
        
        // 火花を散らす
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const spark = document.createElement('div');
                const angle = (Math.random() * 360) * (Math.PI / 180);
                const distance = Math.random() * 500 + 200;
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;
                
                spark.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    width: 8px;
                    height: 8px;
                    background: radial-gradient(circle, #ffff00, #ff4500, #ff0000);
                    border-radius: 50%;
                    box-shadow: 0 0 20px #ff4500;
                    z-index: 9999;
                    pointer-events: none;
                    animation: sparkFly 1.5s ease-out;
                    --endX: ${endX}px;
                    --endY: ${endY}px;
                `;
                
                spark.animate([
                    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                    { transform: `translate(calc(-50% + var(--endX)), calc(-50% + var(--endY))) scale(0)`, opacity: 0 }
                ], {
                    duration: 1500,
                    easing: 'ease-out'
                });
                
                document.body.appendChild(spark);
                setTimeout(() => spark.remove(), 1500);
            }, i * 20);
        }
        
        // 画面全体が白く光る
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 9998;
            pointer-events: none;
            animation: whiteFlash 0.5s ease-out;
        `;
        document.body.appendChild(flash);
        
        // 爆発エフェクト
        const explosion = document.createElement('div');
        explosion.innerHTML = '💥💥💥';
        explosion.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 150px;
            z-index: 10001;
            pointer-events: none;
            animation: explosionPulse 1s ease-out;
            text-shadow: 0 0 30px #ff4500;
        `;
        document.body.appendChild(explosion);
        
        // カメラを激しく揺らす
        document.body.style.animation = 'violentShake 1s ease-out';
        
        // 煙エフェクト
        setTimeout(() => {
            for (let i = 0; i < 20; i++) {
                const smoke = document.createElement('div');
                smoke.innerHTML = '💨';
                smoke.style.cssText = `
                    position: fixed;
                    left: ${40 + Math.random() * 20}%;
                    top: ${40 + Math.random() * 20}%;
                    font-size: ${Math.random() * 60 + 40}px;
                    z-index: 9997;
                    pointer-events: none;
                    opacity: 0.7;
                    animation: smokeRise ${Math.random() * 2 + 2}s ease-out;
                `;
                document.body.appendChild(smoke);
                setTimeout(() => smoke.remove(), 4000);
            }
        }, 500);
        
        if (!document.querySelector('#explosion-style')) {
            const style = document.createElement('style');
            style.id = 'explosion-style';
            style.textContent = `
                @keyframes shockwaveExpand {
                    to {
                        width: 2000px;
                        height: 2000px;
                        opacity: 0;
                        border-width: 20px;
                    }
                }
                @keyframes whiteFlash {
                    0% { opacity: 0; }
                    10% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes explosionPulse {
                    0% {
                        transform: translate(-50%, -50%) scale(0) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(2) rotate(180deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(4) rotate(360deg);
                        opacity: 0;
                    }
                }
                @keyframes violentShake {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    10% { transform: translate(-20px, -20px) rotate(-2deg); }
                    20% { transform: translate(20px, 20px) rotate(2deg); }
                    30% { transform: translate(-20px, 20px) rotate(-2deg); }
                    40% { transform: translate(20px, -20px) rotate(2deg); }
                    50% { transform: translate(-20px, -20px) rotate(-2deg); }
                    60% { transform: translate(20px, 20px) rotate(2deg); }
                    70% { transform: translate(-15px, 15px) rotate(-1deg); }
                    80% { transform: translate(15px, -15px) rotate(1deg); }
                    90% { transform: translate(-10px, 10px) rotate(-0.5deg); }
                }
                @keyframes smokeRise {
                    to {
                        transform: translateY(-200px) scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            shockwave.remove();
            flash.remove();
            explosion.remove();
            document.body.style.animation = '';
        }, 2000);
    }, 3000);
}

/**
 * 隠しコマンドヘルプ表示
 */
function showCommandHelp() {
    // 既存のヘルプを削除
    const existingHelp = document.querySelector('.command-help-panel');
    if (existingHelp) {
        existingHelp.remove();
        return;
    }
    
    const helpPanel = document.createElement('div');
    helpPanel.className = 'command-help-panel';
    helpPanel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%);
        border: 2px solid rgba(99, 102, 241, 0.5);
        border-radius: 20px;
        padding: 2rem;
        z-index: 10001;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.3);
        animation: helpPanelAppear 0.3s ease-out forwards;
        overflow-y: auto;
    `;
    
    helpPanel.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <h2 style="font-size: 2rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                🎮 隠しコマンド一覧
            </h2>
            <p style="color: #94a3b8; font-size: 0.9rem;">キーボードで入力して魔法を発動！</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <!-- 美しい系 -->
            <div style="background: rgba(102, 126, 234, 0.1); border-left: 4px solid #667eea; padding: 1rem; border-radius: 8px;">
                <h3 style="color: #a5b4fc; font-size: 1.1rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                    ✨ 美しいエフェクト
                </h3>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #cbd5e1;"><code style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">magic</code> - 魔法陣召喚</span>
                        <span style="font-size: 1.5rem;">✨</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #cbd5e1;"><code style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">snow</code> - 雪降らし</span>
                        <span style="font-size: 1.5rem;">❄️</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #cbd5e1;"><code style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">star</code> - 流れ星</span>
                        <span style="font-size: 1.5rem;">🌠</span>
                    </div>
                </div>
            </div>
            
            <!-- 楽しい系 -->
            <div style="background: rgba(236, 72, 153, 0.1); border-left: 4px solid #ec4899; padding: 1rem; border-radius: 8px;">
                <h3 style="color: #f9a8d4; font-size: 1.1rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                    🎉 楽しいエフェクト
                </h3>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #cbd5e1;"><code style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">party</code> - パーティーモード</span>
                        <span style="font-size: 1.5rem;">🎊</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #cbd5e1;"><code style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">neko</code> - かわいい猫</span>
                        <span style="font-size: 1.5rem;">🐱</span>
                    </div>
                </div>
            </div>
            
            <!-- 破壊系 -->
            <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 1rem; border-radius: 8px;">
                <h3 style="color: #fca5a5; font-size: 1.1rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                    💥 破壊エフェクト
                </h3>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #cbd5e1;"><code style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">destroy</code> - 破壊の呪文</span>
                        <span style="font-size: 1.5rem;">💥</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #cbd5e1;"><code style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">explosion</code> - 大爆発</span>
                        <span style="font-size: 1.5rem;">💣</span>
                    </div>
                </div>
            </div>
            
            <!-- 特殊系 -->
            <div style="background: rgba(251, 191, 36, 0.1); border-left: 4px solid #fbbf24; padding: 1rem; border-radius: 8px;">
                <h3 style="color: #fcd34d; font-size: 1.1rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                    🎯 特殊コマンド
                </h3>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #cbd5e1;"><code style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">↑↑↓↓←→←→BA</code> - レインボー</span>
                        <span style="font-size: 1.5rem;">🌈</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #cbd5e1;">ロゴを3回クリック - メッセージ</span>
                        <span style="font-size: 1.5rem;">💬</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 1rem;">
                💡 再度 <code style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">help</code> と入力すると閉じます
            </p>
            <button id="closeHelpBtn" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 0.7rem 2rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
                font-size: 1rem;
            ">閉じる</button>
        </div>
    `;
    
    document.body.appendChild(helpPanel);
    
    // 閉じるボタンのイベント
    const closeBtn = helpPanel.querySelector('#closeHelpBtn');
    closeBtn.addEventListener('click', () => {
        helpPanel.style.animation = 'helpPanelDisappear 0.3s ease-out forwards';
        setTimeout(() => helpPanel.remove(), 300);
    });
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.transform = 'scale(1.05)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.transform = 'scale(1)';
    });
    
    // 背景オーバーレイ
    const overlay = document.createElement('div');
    overlay.className = 'help-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        animation: overlayFadeIn 0.3s ease-out;
        backdrop-filter: blur(5px);
    `;
    
    overlay.addEventListener('click', () => {
        helpPanel.style.animation = 'helpPanelDisappear 0.3s ease-out forwards';
        overlay.style.animation = 'overlayFadeOut 0.3s ease-out';
        setTimeout(() => {
            helpPanel.remove();
            overlay.remove();
        }, 300);
    });
    
    document.body.insertBefore(overlay, helpPanel);
    
    // アニメーションスタイルを追加
    if (!document.querySelector('#help-panel-style')) {
        const style = document.createElement('style');
        style.id = 'help-panel-style';
        style.textContent = `
            @keyframes helpPanelAppear {
                from {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
            @keyframes helpPanelDisappear {
                from {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                to {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
            }
            @keyframes overlayFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes overlayFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            .command-help-panel::-webkit-scrollbar {
                width: 8px;
            }
            .command-help-panel::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }
            .command-help-panel::-webkit-scrollbar-thumb {
                background: rgba(99, 102, 241, 0.5);
                border-radius: 4px;
            }
            .command-help-panel::-webkit-scrollbar-thumb:hover {
                background: rgba(99, 102, 241, 0.7);
            }
        `;
        document.head.appendChild(style);
    }
    
    showNotification('📖 隠しコマンド一覧を表示しました！', 'success');
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

/**
 * HTMLダウンロード機能の初期化
 */
function initDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.btn-secondary[download]');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const url = button.getAttribute('href');
            const filename = url.split('/').filter(part => part).pop() || 'index.html';
            
            try {
                // 通知表示
                showNotification('ダウンロードを開始しています...', 'info');
                
                // HTMLファイルを取得してダウンロード
                const response = await fetch(url);
                if (!response.ok) throw new Error('Download failed');
                
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
                
                showNotification('✅ ダウンロード完了！', 'success');
            } catch (error) {
                console.error('Download error:', error);
                showNotification('❌ ダウンロードに失敗しました', 'error');
            }
        });
    });
}

// ダウンロードボタンの初期化
initDownloadButtons();
console.log('✨ Hidden commands: "magic", "snow", "star", "party", "neko"');
console.log('💥 Destruction spells: "destroy", "explosion"');
console.log('📖 Type "help" or "hint" to see all commands!');
console.log('⚠️  Use destruction spells with caution!');
