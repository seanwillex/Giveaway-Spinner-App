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
        this.clearWinnersBtn = document.getElementById('clear-winners-btn');
        
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
                if (this.players.length === 0) {
                    alert('Please add players before spinning the wheel!');
                    return;
                }
                if (this.options.length === 0) {
                    alert('Please add prizes before spinning the wheel!');
                    return;
                }
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

        // Clear winners button
        if (this.clearWinnersBtn) {
            this.clearWinnersBtn.addEventListener('click', () => {
                if (this.winners.length === 0) {
                    return;
                }
                if (confirm('Are you sure you want to clear the winners list?')) {
                    this.winners = [];
                    this.saveWinners();
                    this.renderWinners();
                }
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
        
        console.log('Spinning wheel...');
        
        // Make sure we have options to spin
        if (!this.options || this.options.length < 2) {
            alert('Please add at least 2 prizes to spin the wheel!');
            return;
        }
        
        this.selectedPlayer = this.selectRandomPlayer();
        if (!this.selectedPlayer) return;

        this.isSpinning = true;
        const spinDuration = 5000; // 5 seconds
        
        const startAngle = this.rotation;
        const minSpins = 5; // Minimum number of full rotations
        const maxSpins = 10; // Maximum number of full rotations
        const spins = minSpins + Math.random() * (maxSpins - minSpins);
        const targetAngle = startAngle + (spins * Math.PI * 2) + this.calculateTargetAngle();
        
        this.animate(startAngle, targetAngle, spinDuration, () => {
            this.isSpinning = false;
            this.showResult();
            this.celebrateWinner();
        });
    }

    calculateTargetAngle() {
        const targetIndex = Math.floor(Math.random() * this.options.length);
        return (targetIndex * (Math.PI * 2 / this.options.length));
    }

    animate(startAngle, targetAngle, duration, callback) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth deceleration
            const easeOut = (t) => 1 - Math.pow(1 - t, 3);
            
            // Calculate current rotation
            this.rotation = startAngle + (targetAngle - startAngle) * easeOut(progress);
            
            // Draw the wheel
            this.drawWheel();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(animate);
    }

    showResult() {
        const winningOption = this.getSelectedSegment();
        if (this.modalText) {
            this.modalText.innerHTML = `
                <div class="winner-info">
                    <div class="congratulations">CONGRATULATIONS</div>
                    <div class="winner-player">${this.selectedPlayer}</div>
                    <div class="winner-prize">You have won:</div>
                    <div class="winner-option">${winningOption}</div>
                </div>
            `;
        }
        if (this.modal) {
            this.modal.style.display = 'flex';
            // Trigger reflow to ensure transition works
            this.modal.offsetHeight;
            this.modal.classList.add('show');
        }
        
        // Add to winners list
        this.addWinner(this.selectedPlayer, winningOption);
    }

    getSelectedSegment() {
        let currentRotation = this.rotation % (2 * Math.PI);
        if (currentRotation < 0) {
            currentRotation += 2 * Math.PI;
        }
        
        const segmentAngle = (2 * Math.PI) / this.options.length;
        // Adjust the rotation to align with the pointer at top (subtract PI/2)
        const adjustedRotation = (2 * Math.PI - currentRotation - Math.PI/2) % (2 * Math.PI);
        const index = Math.floor(adjustedRotation / segmentAngle);
        
        // Ensure the index is within bounds
        return this.options[((index % this.options.length) + this.options.length) % this.options.length];
    }

    celebrateWinner() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    loadPlayers() {
        this.players = JSON.parse(localStorage.getItem('players')) || [];
    }

    selectRandomPlayer() {
        if (this.players.length === 0) {
            alert('Please add players in the settings page first!');
            return null;
        }
        const randomIndex = Math.floor(Math.random() * this.players.length);
        return this.players[randomIndex];
    }

    addWinner(player, prize) {
        const now = new Date();
        const winner = {
            player,
            prize,
            timestamp: now.toISOString(),
            id: Date.now()
        };
        
        // Remove the winner from the players list
        const playerIndex = this.players.indexOf(player);
        if (playerIndex !== -1) {
            this.players.splice(playerIndex, 1);
            localStorage.setItem('players', JSON.stringify(this.players));
            
            // Update the settings page if it exists
            const settingsPage = document.querySelector('.settings-page');
            if (settingsPage) {
                const event = new CustomEvent('playerRemoved', { detail: { player } });
                document.dispatchEvent(event);
            }
        }
        
        this.winners.unshift(winner);
        if (this.winners.length > 50) {
            this.winners.pop();
        }
        
        this.saveWinners();
        this.renderWinners();
    }

    loadWinners() {
        const saved = localStorage.getItem('wheelWinners');
        this.winners = saved ? JSON.parse(saved) : [];
    }

    saveWinners() {
        localStorage.setItem('wheelWinners', JSON.stringify(this.winners));
    }

    renderWinners() {
        if (!this.winnersList) return;

        this.winnersList.innerHTML = '';
        
        if (this.winners.length === 0) {
            this.winnersList.innerHTML = `
                <div class="winner-entry">
                    <div class="winner-icon">🎯</div>
                    <div class="winner-details">
                        <div class="winner-name">No winners yet</div>
                    </div>
                </div>
            `;
            return;
        }

        this.winners.forEach((winner, index) => {
            const winnerElement = document.createElement('div');
            winnerElement.className = 'winner-entry' + (index === 0 ? ' new' : '');
            winnerElement.innerHTML = `
                <div class="winner-icon">${index === 0 ? '🏆' : '🎯'}</div>
                <div class="winner-details">
                    <div class="winner-name">${winner.player}</div>
                    <div class="winner-prize">${winner.prize}</div>
                </div>
            `;
            
            this.winnersList.appendChild(winnerElement);
        });
    }

    loadOptions() {
        return JSON.parse(localStorage.getItem('wheelOptions')) || [];
    }

    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300); // Match the transition duration
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Wheel App...');
    new WheelApp();
});
