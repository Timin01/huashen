class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'peanut' 或 'sesame'
        this.radius = type === 'peanut' ? 4 : 2;
        this.vx = 0;
        this.vy = 0;
        this.isLaunched = false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'peanut' ? '#D2691E' : '#808080';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this.isLaunched) {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.1;
        }
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.peanutGroup = { x: 200, y: 300, particles: [] };  // 花生團
        this.sesameGroup = { x: 600, y: 300, particles: [] };  // 芝麻團
        this.launchedPeanuts = [];  // 正在移動中的花生
        this.totalPeanuts = 50;     // 總花生數量
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

        // 檢查是否還有可發射的花生
        const availablePeanuts = this.peanutGroup.particles.filter(p => !p.isLaunched);
        if (availablePeanuts.length === 0) return;

        // 發射5顆花生（或剩餘的所有花生）
        const numPeanutsToLaunch = Math.min(5, availablePeanuts.length);
        
        for (let i = 0; i < numPeanutsToLaunch; i++) {
            const peanut = availablePeanuts[i];
            peanut.isLaunched = true;
            
            // 設定發射速度和方向
            peanut.vx = 5 + Math.random() * 2;
            peanut.vy = -2 + Math.random() * 4;
            
            // 加入到發射中的花生陣列
            this.launchedPeanuts.push(peanut);
            
            // 從花生團移除
            const index = this.peanutGroup.particles.indexOf(peanut);
            if (index > -1) {
                this.peanutGroup.particles.splice(index, 1);
            }
        }
    }

    checkCollisions() {
        const sesameCenter = this.sesameGroup;
        
        for (let i = this.launchedPeanuts.length - 1; i >= 0; i--) {
            const peanut = this.launchedPeanuts[i];
            
            // 檢查是否超出畫布範圍
            if (peanut.x < 0 || peanut.x > this.canvas.width || 
                peanut.y < 0 || peanut.y > this.canvas.height) {
                // 將花生送回花生團
                peanut.isLaunched = false;
                peanut.vx = 0;
                peanut.vy = 0;
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 30;
                peanut.x = this.peanutGroup.x + Math.cos(angle) * radius;
                peanut.y = this.peanutGroup.y + Math.sin(angle) * radius;
                
                this.launchedPeanuts.splice(i, 1);
                this.peanutGroup.particles.push(peanut);
                continue;
            }
            
            // 檢查是否進入芝麻團
            const dx = peanut.x - sesameCenter.x;
            const dy = peanut.y - sesameCenter.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 50) {
                peanut.isLaunched = false;
                peanut.vx = 0;
                peanut.vy = 0;
                
                // 給予在芝麻團內的隨機位置
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 40;
                peanut.x = sesameCenter.x + Math.cos(angle) * radius;
                peanut.y = sesameCenter.y + Math.sin(angle) * radius;
                
                this.launchedPeanuts.splice(i, 1);
                this.sesameGroup.particles.push(peanut);
            }
        }

        // 檢查遊戲是否結束（所有花生都在芝麻團中）
        if (this.sesameGroup.particles.filter(p => p.type === 'peanut').length === this.totalPeanuts) {
            this.isGameOver = true;
            setTimeout(() => alert('遊戲結束！花生和芝麻完美混合了！'), 100);
        }
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 繪製花生團
        this.peanutGroup.particles.forEach(particle => {
            particle.draw(this.ctx);
        });

        // 繪製芝麻團
        this.sesameGroup.particles.forEach(particle => {
            particle.draw(this.ctx);
        });

        // 更新和繪製發射中的花生
        this.launchedPeanuts.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        this.checkCollisions();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// 啟動遊戲
new Game();