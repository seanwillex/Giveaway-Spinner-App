class WheelApp {
    constructor() {
        this.initializeElements();
        this.setupInitialState();
        this.loadSavedData();
        this.init();
    }

    initializeElements() {
        // Canvas and UI elements
        this.canvas = document.getElementById('wheel');
        this.ctx = this.canvas.getContext('2d');
        this.spinBtn = document.getElementById('spin-btn');
        this.homeBtn = document.getElementById('home-btn');
        this.settingsBtn = document.getElementById('settings-btn');
        this.winnersList = document.getElementById('winners-list');
        
        // Modal elements
        this.modal = document.getElementById('result-modal');
        this.modalText = document.getElementById('result-text');
        this.closeButton = document.querySelector('.close-button');

        // Verify critical elements
        if (!this.canvas) console.error('Wheel canvas not found');
        if (!this.spinBtn) console.error('Spin button not found');
        if (!this.winnersList) console.error('Winners list not found');
    }

    setupInitialState() {
        this.options = [];
        this.players = [];
        this.selectedPlayer = null;
        this.winners = [];
        this.rotation = 0;
        this.isSpinning = false;
        
        // 10 distinct vibrant colors
        this.colors = [
            '#FF3366', // Vibrant Pink
            '#33CC33', // Lime Green
            '#3366FF', // Royal Blue
            '#FF9933', // Orange
            '#9933FF', // Purple
            '#33CCFF', // Sky Blue
            '#FFCC00', // Golden Yellow
            '#FF3333', // Red
            '#00CC99', // Turquoise
            '#FF66FF'  // Hot Pink
        ];
    }

    loadSavedData() {
        // Load saved options
        const savedOptions = this.loadOptions();
        if (savedOptions && Array.isArray(savedOptions)) {
            this.options = savedOptions;
        }

        // Load saved players
        this.loadPlayers();
        
        // Load saved winners
        this.loadWinners();
        this.renderWinners();
    }

    init() {
        this.setupEventListeners();
        this.handleResize();
        this.drawWheel();
    }
    
    setupEventListeners() {
        // Spin button
        if (this.spinBtn) {
            this.spinBtn.addEventListener('click', () => {
                console.log('Spin button clicked');
                this.spin();
            });
        }
        
        // Navigation buttons
        if (this.homeBtn) {
            this.homeBtn.addEventListener('click', () => {
                console.log('Home button clicked');
                window.location.href = 'index.html';
            });
        }
        
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', () => {
                console.log('Settings button clicked');
                window.location.href = 'settings.html';
            });
        }

        // Modal close button
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        if (!this.canvas || !this.ctx) return;
        
        const container = this.canvas.parentElement;
        const size = Math.min(container.clientWidth, container.clientHeight);
        
        // Set the canvas size to match container
        this.canvas.width = size;
        this.canvas.height = size;
        
        // Scale for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        this.canvas.style.width = size + 'px';
        this.canvas.style.height = size + 'px';
        this.canvas.width = size * dpr;
        this.canvas.height = size * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.drawWheel();
    }

    drawWheel() {
        if (!this.canvas || !this.ctx || this.options.length === 0) return;
        
        const center = this.canvas.width / (2 * window.devicePixelRatio);
        const radius = (this.canvas.width / (2 * window.devicePixelRatio)) - 10;
        const segmentAngle = (2 * Math.PI) / this.options.length;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw segments
        this.options.forEach((option, index) => {
            const startAngle = index * segmentAngle + this.rotation;
            const endAngle = startAngle + segmentAngle;
            
            // Draw segment
            this.ctx.beginPath();
            this.ctx.moveTo(center, center);
            this.ctx.arc(center, center, radius, startAngle, endAngle);
            this.ctx.closePath();
            
            // Fill segment
            this.ctx.fillStyle = this.colors[index % this.colors.length];
            this.ctx.fill();
            
            // Add border
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw text
            this.ctx.save();
            this.ctx.translate(center, center);
            this.ctx.rotate(startAngle + (segmentAngle / 2));
            
            // Align text
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'middle';
            
            // Add text with outline
            this.ctx.font = 'bold 24px Poppins';
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeText(option, radius - 20, 0);
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(option, radius - 20, 0);
            
            this.ctx.restore();
        });
    }

    spin() {
        if (this.isSpinning) return;
        
        const options = this.loadOptions();
        if (!options || options.length === 0) {
            alert('Please add some prizes in the settings first!');
            return;
        }

        // Load and check players
        this.loadPlayers();
        if (!this.players || this.players.length === 0) {
            alert('Please add players in the settings first!');
            return;
        }

        this.isSpinning = true;
        this.spinBtn.disabled = true;

        // Select a random player
        const randomPlayerIndex = Math.floor(Math.random() * this.players.length);
        const selectedPlayer = this.players[randomPlayerIndex];

        // Calculate random stop angle
        const stopAngle = Math.random() * Math.PI * 2;
        const rounds = 4; // Number of full rotations
        const spinDuration = 5000; // Duration in milliseconds
        const startRotation = this.rotation;
        const totalRotation = (Math.PI * 2 * rounds) + stopAngle;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            
            // Easing function for smooth deceleration
            const easeOut = t => 1 - Math.pow(1 - t, 3);
            const currentRotation = startRotation + (totalRotation * easeOut(progress));
            
            this.rotation = currentRotation;
            this.drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                this.spinBtn.disabled = false;
                
                // Calculate winner
                const winningIndex = Math.floor(((currentRotation % (Math.PI * 2)) / (Math.PI * 2)) * this.options.length);
                const prize = this.options[winningIndex];
                
                // Use the selected player's name
                this.handleWin(selectedPlayer, prize);
            }
        };

        requestAnimationFrame(animate);
    }

    handleWin(winner, prize) {
        // Add confetti effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Add to winners list
        this.addWinner(winner, prize);

        // Show modal with result
        this.showModal(`
            <div class="winner-modal-content">
                <div class="winner-modal-player"> ${winner}</div>
                <div class="winner-modal-text">Congratulations! You've Won</div>
                <div class="winner-modal-prize">${prize}</div>
            </div>
        `);
    }

    loadWinners() {
        const savedWinners = localStorage.getItem('winners');
        this.winners = savedWinners ? JSON.parse(savedWinners) : [];
    }

    saveWinners() {
        localStorage.setItem('winners', JSON.stringify(this.winners));
    }

    addWinner(winner, prize) {
        const timestamp = new Date().toLocaleString();
        this.winners.unshift({ winner, prize, timestamp });
        this.saveWinners();
        this.renderWinners();
    }

    clearWinners() {
        this.winners = [];
        localStorage.removeItem('winners');
        document.querySelector('.winners-list').innerHTML = '';
    }

    renderWinners() {
        if (!this.winnersList) return;

        this.winnersList.innerHTML = '';
        
        this.winners.forEach((winner, index) => {
            const winnerElement = document.createElement('div');
            winnerElement.className = 'winner-item';
            winnerElement.innerHTML = `
                <div class="winner-number">${index + 1}</div>
                <div class="winner-info">
                    <div class="winner-name">${winner.winner}</div>
                    <div class="winner-timestamp">${winner.timestamp}</div>
                </div>
                <div class="winner-prize" title="${winner.prize}">${winner.prize}</div>
            `;
            this.winnersList.appendChild(winnerElement);
        });
    }

    loadPlayers() {
        const savedPlayers = localStorage.getItem('players');
        this.players = savedPlayers ? JSON.parse(savedPlayers) : [];
    }

    selectRandomPlayer() {
        if (this.players.length === 0) {
            alert('Please add players in the settings page first!');
            return null;
        }
        const randomIndex = Math.floor(Math.random() * this.players.length);
        return this.players[randomIndex];
    }

    loadOptions() {
        return JSON.parse(localStorage.getItem('wheelOptions')) || [];
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    showModal(message) {
        if (this.modalText) {
            this.modalText.innerHTML = message;
        }
        if (this.modal) {
            this.modal.style.display = 'flex';
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Wheel App...');
    new WheelApp();
});
