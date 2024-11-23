class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'peanut' 或 'sesame'
        this.radius = type === 'peanut' ? 4 : 2;
        this.vx = 0;
        this.vy = 0;
        this.isMoving = false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'peanut' ? '#D2691E' : '#808080';
        ctx.fill();
        ctx.closePath();
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.peanutGroup = { x: 200, y: 300, particles: [] };
        this.sesameGroup = { x: 600, y: 300, particles: [] };
        this.totalPeanuts = 50;
        this.isGameOver = false;

        this.initializeParticles();
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        this.gameLoop();
    }

    initializeParticles() {
        // 初始化花生團
        for (let i = 0; i < this.totalPeanuts; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 30;
            this.peanutGroup.particles.push(new Particle(
                this.peanutGroup.x + Math.cos(angle) * radius,
                this.peanutGroup.y + Math.sin(angle) * radius,
                'peanut'
            ));
        }

        // 初始化芝麻團
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 40;
            this.sesameGroup.particles.push(new Particle(
                this.sesameGroup.x + Math.cos(angle) * radius,
                this.sesameGroup.y + Math.sin(angle) * radius,
                'sesame'
            ));
        }
    }

    handleClick(event) {
        if (this.isGameOver) return;

        // 每次點擊，從花生團發射一些花生
        const numPeanutsToLaunch = Math.min(5, this.peanutGroup.particles.length);
        
        for (let i = 0; i < numPeanutsToLaunch; i++) {
            const peanut = this.peanutGroup.particles[i];
            // 設定發射速度和方向
            peanut.vx = 5 + Math.random() * 2;
            peanut.vy = -2 + Math.random() * 4;
            peanut.isMoving = true;
        }
    }

    updateParticles() {
        for (let peanut of this.peanutGroup.particles) {
            if (peanut.isMoving) {
                // 更新移動中花生的位置
                peanut.x += peanut.vx;
                peanut.y += peanut.vy;

                // 檢查是否進入芝麻團範圍
                const dx = peanut.x - this.sesameGroup.x;
                const dy = peanut.y - this.sesameGroup.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 50) {
                    // 將花生從花生團移除
                    const index = this.peanutGroup.particles.indexOf(peanut);
                    if (index > -1) {
                        this.peanutGroup.particles.splice(index, 1);
                        // 加入到芝麻團
                        this.sesameGroup.particles.push(peanut);
                        // 重置花生狀態
                        peanut.isMoving = false;
                        peanut.vx = 0;
                        peanut.vy = 0;
                        // 給予在芝麻團內的隨機位置
                        const angle = Math.random() * Math.PI * 2;
                        const radius = Math.random() * 40;
                        peanut.x = this.sesameGroup.x + Math.cos(angle) * radius;
                        peanut.y = this.sesameGroup.y + Math.sin(angle) * radius;
                    }
                }

                // 如果花生超出畫布，回到花生團
                if (peanut.x < 0 || peanut.x > this.canvas.width || 
                    peanut.y < 0 || peanut.y > this.canvas.height) {
                    peanut.isMoving = false;
                    peanut.vx = 0;
                    peanut.vy = 0;
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 30;
                    peanut.x = this.peanutGroup.x + Math.cos(angle) * radius;
                    peanut.y = this.peanutGroup.y + Math.sin(angle) * radius;
                }
            }
        }

        // 檢查遊戲是否結束
        if (this.peanutGroup.particles.length === 0) {
            this.isGameOver = true;
            setTimeout(() => alert('遊戲結束！花生和芝麻完美混合了！'), 100);
        }
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新所有粒子狀態
        this.updateParticles();

        // 繪製花生團
        this.peanutGroup.particles.forEach(particle => {
            particle.draw(this.ctx);
        });

        // 繪製芝麻團
        this.sesameGroup.particles.forEach(particle => {
            particle.draw(this.ctx);
        });

        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// 啟動遊戲
new Game();