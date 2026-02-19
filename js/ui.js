// =============================================================================
// UI - SETTINGS MODAL
// =============================================================================

function openSettings() {
    document.getElementById('settings-overlay').classList.add('active');
}

function closeSettings() {
    document.getElementById('settings-overlay').classList.remove('active');
}

// =============================================================================
// SCREEN WAKE LOCK
// =============================================================================

let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake lock active');
            
            wakeLock.addEventListener('release', () => {
                console.log('Wake lock released');
            });
        }
    } catch (err) {
        console.error('Wake lock failed:', err);
    }
}

// Request wake lock when app loads
requestWakeLock();

// Re-request wake lock when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && wakeLock === null) {
        requestWakeLock();
    }
});
