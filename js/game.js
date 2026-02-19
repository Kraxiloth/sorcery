// =============================================================================
// GAME MECHANICS
// =============================================================================

function adjustLife(playerIndex, amount) {
    players[playerIndex].life = Math.max(0, Math.min(20, players[playerIndex].life + amount));
    updateDisplay(playerIndex);
}

function adjustMana(playerIndex, type, amount) {
    const player = players[playerIndex];
    if (type === 'max') {
        player.maxMana = Math.max(0, player.maxMana + amount);
        // Sync current mana with the new maximum
        player.mana = Math.min(player.mana + amount, player.maxMana);
        player.mana = Math.max(0, player.mana);
    } else {
        player.mana = Math.max(0, Math.min(player.maxMana, player.mana + amount));
    }
    updateDisplay(playerIndex);
}

function adjustThreshold(playerIndex, element, amount) {
    players[playerIndex].threshold[element] = Math.max(0, players[playerIndex].threshold[element] + amount);
    updateDisplay(playerIndex);
}

function newTurn() {
    players.forEach((player, index) => {
        player.mana = player.maxMana;
        updateDisplay(index);
    });
}

function resetGame() {
    if (confirm("Reset all players to default state? This will clear all game progress.")) {
        players = players.map(player => createPlayer(player.name));
        players.forEach((_, index) => updateDisplay(index));
        
        // Stop and reset timers
        stopTimer();
        timerRunning = false;
        globalTimerStart = null;
        players.forEach(player => player.timerStart = null);
        
        // Reset play button icons to play state
        document.querySelectorAll('.timer-control').forEach(btn => {
            btn.textContent = '▶';
        });
        
        // Reset timer displays based on mode
        players.forEach((_, index) => {
            const timerEl = document.getElementById(`timer${index + 1}`);
            if (timerEl) {
                if (timerMode === 'countdown') {
                    // Show countdown duration
                    timerEl.textContent = formatTime(timerDuration * 60);
                } else {
                    // Show 0:00 for elapsed mode
                    timerEl.textContent = '0:00';
                }
                timerEl.classList.remove('timer-expired');
            }
        });
        
        saveGameState();
    }
}
