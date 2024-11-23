class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'peanut' 或 'sesame'
        this.radius = type === 'peanut' ? 4 : 2;
        this.vx = 0;
        this.vy = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'peanut' ? '#D2691E' : '#808080';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.peanuts = [];
        this.sesames = [];
        this.isGameOver = false;

        // 初始化花生和芝麻群
        this.initializeParticles();
        
        // 添加點擊事件
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        
        // 開始遊戲循環
        this.gameLoop();
    }

    initializeParticles() {
        // 創建初始花生群
        for (let i = 0; i < 50; i++) {
            this.peanuts.push(new Particle(200, 300 + Math.random() * 50, 'peanut'));
        }

        // 創建初始芝麻群
        for (let i = 0; i < 100; i++) {
            this.sesames.push(new Particle(600, 300 + Math.random() * 50, 'sesame'));
        }
    }

    handleClick(event) {
        if (this.isGameOver) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 發射一些花生，現在會以固定角度直線移動
        for (let i = 0; i < 10; i++) {
            const peanut = this.peanuts[i];
            peanut.vx = 5; // 固定水平速度
            peanut.vy = 0; // 不加入垂直速度，或可以設定小數值製造些微偏移
        }
    }

    checkCollisions() {
        let combined = true;
        const threshold = 100;

        // 檢查所有粒子是否都在一起
        for (const peanut of this.peanuts) {
            for (const sesame of this.sesames) {
                const dx = peanut.x - sesame.x;
                const dy = peanut.y - sesame.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > threshold) {
                    combined = false;
                    break;
                }
            }
        }

        if (combined) {
            this.isGameOver = true;
            alert('遊戲結束！花生和芝麻完美混合了！');
        }
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和繪製所有粒子
        [...this.peanuts, ...this.sesames].forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        this.checkCollisions();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// 啟動遊戲
new Game();