class SettingsPage {
    constructor() {
        this.initializeElements();
        this.loadSettings();
        this.setupEventListeners();
        this.players = [];
        this.currentSlots = 20; // Initial number of slots to show
        this.loadPlayers();
        this.renderPlayers();
        this.initializePrizes();

        // Listen for player removal events from the wheel
        document.addEventListener('playerRemoved', (event) => {
            this.loadPlayers(); // Reload the players list
            this.renderPlayers(); // Re-render the players grid
        });
    }

    initializeElements() {
        // Navigation buttons
        this.homeBtn = document.getElementById('home-btn');
        this.settingsBtn = document.getElementById('settings-btn');

        // Settings inputs
        this.soundEnabled = document.getElementById('sound-enabled');
        this.autoSave = document.getElementById('auto-save');
        this.darkMode = document.getElementById('dark-mode');
        this.spinDuration = document.getElementById('spin-duration');
        this.spinDurationValue = document.getElementById('spin-duration-value');

        // Prize List elements
        this.prizesGrid = document.querySelector('.prizes-grid');
        this.prizeCount = document.querySelector('.prize-count');

        // Players elements
        this.playersList = document.getElementById('players-list');
        this.addPlayerBtn = document.getElementById('add-player-btn');
        this.playerCount = document.querySelector('.player-count');

        // Verify elements are found
        if (!this.addPlayerBtn) console.error('Add Player button not found!');
        if (!this.playersList) console.error('Players list container not found!');
        if (!this.playerCount) console.error('Player count element not found!');
        if (!this.optionsTextarea) console.error('Options textarea not found!');
        if (!this.updateWheelBtn) console.error('Update wheel button not found!');
    }

    loadSettings() {
        const preferences = JSON.parse(localStorage.getItem('preferences')) || {
            soundEnabled: true,
            autoSave: true,
            theme: 'light',
            spinDuration: 5
        };

        this.soundEnabled.checked = preferences.soundEnabled;
        this.autoSave.checked = preferences.autoSave;
        this.darkMode.checked = preferences.theme === 'dark';
        this.spinDuration.value = preferences.spinDuration || 5;
        this.updateSpinDurationValue();

        // Load saved options for the wheel
        const savedOptions = JSON.parse(localStorage.getItem('wheelOptions')) || [];
        if (this.optionsTextarea) {
            this.optionsTextarea.value = savedOptions.join('\n');
            this.updatePrizeCount();
        }

        document.documentElement.setAttribute('data-theme', preferences.theme);
    }

    loadPlayers() {
        this.players = JSON.parse(localStorage.getItem('players')) || [];
        this.updatePlayerCount();
    }

    savePlayers() {
        localStorage.setItem('players', JSON.stringify(this.players));
        this.updatePlayerCount();
    }

    updatePlayerCount() {
        if (this.playerCount) {
            const remainingSlots = 30 - this.players.length;
            this.playerCount.textContent = `${this.players.length}/30 Players (${remainingSlots} slots available)`;
        }
    }

    renderPlayers() {
        if (!this.playersList) return;
        
        this.playersList.innerHTML = '';
        const playersToShow = this.players.slice(0, this.currentSlots);

        // Render existing players
        playersToShow.forEach((player, index) => {
            const playerElement = document.createElement('div');
            playerElement.className = 'player-item';
            playerElement.innerHTML = `
                <span class="player-number">${index + 1}</span>
                <span class="player-name" title="${player}">${player}</span>
                <div class="player-actions">
                    <button class="player-action-btn edit-btn" data-index="${index}" title="Edit">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button class="player-action-btn delete-btn" data-index="${index}" title="Delete">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            `;

            // Add event listeners for edit and delete buttons
            const editBtn = playerElement.querySelector('.edit-btn');
            const deleteBtn = playerElement.querySelector('.delete-btn');
            editBtn.addEventListener('click', () => this.editPlayer(index));
            deleteBtn.addEventListener('click', () => this.deletePlayer(index));

            this.playersList.appendChild(playerElement);
        });

        // Add empty slots to complete the grid
        const emptySlots = this.currentSlots - playersToShow.length;
        for (let i = 0; i < emptySlots; i++) {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'player-item empty';
            emptySlot.title = 'Add Player';
            emptySlot.addEventListener('click', () => {
                if (this.players.length < 30) {
                    this.addPlayer();
                }
            });
            this.playersList.appendChild(emptySlot);
        }

        // Add "More" button if we haven't reached the maximum slots
        if (this.currentSlots < 30) {
            const moreButtonContainer = document.createElement('div');
            moreButtonContainer.className = 'more-button-container';

            const moreButton = document.createElement('button');
            moreButton.className = 'more-players-btn';
            moreButton.textContent = 'Show More Slots';
            moreButton.onclick = () => {
                this.currentSlots = Math.min(this.currentSlots + 20, 30); // Add 20 more slots, up to max 30
                this.renderPlayers();
            };
            moreButtonContainer.appendChild(moreButton);
            this.playersList.appendChild(moreButtonContainer);
        }
    }

    addPlayer() {
        if (this.players.length >= 30) {
            alert('Maximum number of players (30) reached!');
            return;
        }

        const playerName = prompt('Enter player name:');
        if (playerName && playerName.trim()) {
            this.players.push(playerName.trim());
            this.savePlayers();
            this.renderPlayers();
        }
    }

    editPlayer(index) {
        const newName = prompt('Edit player name:', this.players[index]);
        if (newName && newName.trim()) {
            this.players[index] = newName.trim();
            this.savePlayers();
            this.renderPlayers();
        }
    }

    deletePlayer(index) {
        if (confirm('Are you sure you want to delete this player?')) {
            this.players.splice(index, 1);
            this.savePlayers();
            this.renderPlayers();
        }
    }

    updateSpinDurationValue() {
        const duration = parseInt(this.spinDuration.value);
        this.spinDurationValue.textContent = duration === 1 ? '1s' : `${duration}s`;
    }

    updatePrizeCount() {
        if (this.prizeCount && this.optionsTextarea) {
            const options = this.optionsTextarea.value.split('\n').filter(option => option.trim() !== '');
            this.prizeCount.textContent = `${options.length}/10 Prizes`;
        }
    }

    initializePrizes() {
        if (!this.prizesGrid) return;
        this.prizes = JSON.parse(localStorage.getItem('wheelOptions')) || [];
        this.renderPrizes();
    }

    renderPrizes() {
        if (!this.prizesGrid) return;
        
        this.prizesGrid.innerHTML = '';
        const totalSlots = 10; // 2 columns × 5 rows

        // Render existing prizes
        this.prizes.forEach((prize, index) => {
            const prizeElement = document.createElement('div');
            prizeElement.className = 'prize-item';
            prizeElement.innerHTML = `
                <span class="prize-number">${index + 1}</span>
                <span class="prize-name" title="${prize}">${prize}</span>
                <div class="prize-actions">
                    <button class="player-action-btn edit-btn" data-index="${index}" title="Edit">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button class="player-action-btn delete-btn" data-index="${index}" title="Delete">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            `;
            this.prizesGrid.appendChild(prizeElement);
        });

        // Add empty slots to fill the grid
        const emptySlots = totalSlots - this.prizes.length;
        for (let i = 0; i < emptySlots; i++) {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'prize-item empty';
            emptySlot.title = 'Add Prize';
            emptySlot.addEventListener('click', () => {
                if (this.prizes.length < 10) {
                    this.addPrize();
                }
            });
            this.prizesGrid.appendChild(emptySlot);
        }

        // Update prize count
        if (this.prizeCount) {
            this.prizeCount.textContent = `${this.prizes.length}/10 prizes`;
        }
    }

    addPrize() {
        if (this.prizes.length >= 10) {
            alert('Maximum number of prizes (10) reached!');
            return;
        }

        const prizeName = prompt('Enter prize name:');
        if (prizeName && prizeName.trim()) {
            this.prizes.push(prizeName.trim());
            this.savePrizes();
            this.renderPrizes();
        }
    }

    editPrize(index) {
        const newName = prompt('Edit prize name:', this.prizes[index]);
        if (newName && newName.trim()) {
            this.prizes[index] = newName.trim();
            this.savePrizes();
            this.renderPrizes();
        }
    }

    deletePrize(index) {
        if (confirm('Are you sure you want to remove this prize?')) {
            this.prizes.splice(index, 1);
            this.savePrizes();
            this.renderPrizes();
        }
    }

    savePrizes() {
        localStorage.setItem('wheelOptions', JSON.stringify(this.prizes));
    }

    setupEventListeners() {
        // Navigation
        this.homeBtn.addEventListener('click', () => window.location.href = 'index.html');
        
        // Settings changes
        this.darkMode.addEventListener('change', () => {
            const theme = this.darkMode.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            this.saveSettings();
        });

        this.soundEnabled.addEventListener('change', () => this.saveSettings());
        this.autoSave.addEventListener('change', () => this.saveSettings());
        this.spinDuration.addEventListener('input', () => {
            this.updateSpinDurationValue();
            this.saveSettings();
        });

        // Prize List event listeners
        if (this.updateWheelBtn) {
            this.updateWheelBtn.addEventListener('click', () => {
                this.updateWheelOptions();
            });
        }

        if (this.optionsTextarea) {
            this.optionsTextarea.addEventListener('input', () => {
                this.updatePrizeCount();
            });
        }

        // Player management
        if (this.addPlayerBtn) {
            console.log('Setting up add player button listener');
            this.addPlayerBtn.addEventListener('click', () => {
                console.log('Add player button clicked');
                this.addPlayer();
            });
        }

        if (this.playersList) {
            this.playersList.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (!button) return;

                const index = parseInt(button.dataset.index);
                if (button.classList.contains('edit-btn')) {
                    this.editPlayer(index);
                } else if (button.classList.contains('delete-btn')) {
                    this.deletePlayer(index);
                }
            });
        }

        // Prize List event listeners
        if (this.prizesGrid) {
            this.prizesGrid.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (!button) return;

                const index = parseInt(button.dataset.index);
                if (button.classList.contains('edit-btn')) {
                    this.editPrize(index);
                } else if (button.classList.contains('delete-btn')) {
                    this.deletePrize(index);
                }
            });
        }
    }

    saveSettings() {
        const preferences = {
            soundEnabled: this.soundEnabled.checked,
            autoSave: this.autoSave.checked,
            theme: this.darkMode.checked ? 'dark' : 'light',
            spinDuration: parseInt(this.spinDuration.value)
        };

        localStorage.setItem('preferences', JSON.stringify(preferences));
    }

    updateWheelOptions() {
        if (!this.optionsTextarea) return;
        
        const options = this.optionsTextarea.value
            .split('\n')
            .map(option => option.trim())
            .filter(option => option !== '');

        if (options.length === 0) {
            alert('Please enter at least one prize!');
            return;
        }

        if (options.length > 10) {
            alert('Maximum number of prizes (10) exceeded!');
            return;
        }

        localStorage.setItem('wheelOptions', JSON.stringify(options));
        alert('Wheel options updated successfully!');
    }
}

// Initialize the settings page when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Settings Page');
    new SettingsPage();
});
