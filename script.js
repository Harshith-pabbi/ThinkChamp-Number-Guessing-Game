/**
 * Think Champ Pvt Ltd - Number Guessing Game Web Interface Logic
 */

// Difficulty Preset Configurations
const DIFFICULTIES = {
    easy: { name: 'Easy', min: 1, max: 50, attempts: 10 },
    medium: { name: 'Medium', min: 1, max: 100, attempts: 7 },
    hard: { name: 'Hard', min: 1, max: 200, attempts: 5 }
};

// Game State
let currentDiff = 'medium';
let minNum = DIFFICULTIES.medium.min;
let maxNum = DIFFICULTIES.medium.max;
let maxAttempts = DIFFICULTIES.medium.attempts;
let secretNum = 0;
let attemptsLeft = maxAttempts;
let attemptsUsed = 0;
let guessHistory = [];
let gameActive = true;
let soundEnabled = true;

// DOM Elements
const diffBtns = document.querySelectorAll('.diff-btn');
const customCard = document.getElementById('custom-config-card');
const applyCustomBtn = document.getElementById('apply-custom-btn');

const rangeText = document.getElementById('range-text');
const attemptsLeftVal = document.getElementById('attempts-left-val');
const progressCircle = document.getElementById('meter-progress-path');

const guessForm = document.getElementById('guess-form');
const guessInput = document.getElementById('guess-input');
const inputFeedback = document.getElementById('input-feedback');
const gameCard = document.getElementById('game-card');

const hintContainer = document.getElementById('hint-box-container');
const latestHintCard = document.getElementById('latest-hint-card');
const hintBadge = document.getElementById('hint-badge');
const hintDetail = document.getElementById('hint-detail');

const historyList = document.getElementById('history-list');
const emptyHistoryState = document.getElementById('empty-history-state');
const attemptBadge = document.getElementById('attempt-badge');

const resultModal = document.getElementById('result-modal');
const resultIcon = document.getElementById('result-icon');
const resultTitle = document.getElementById('result-title');
const resultDesc = document.getElementById('result-desc');
const secretDisplay = document.getElementById('secret-number-display');
const playAgainBtn = document.getElementById('play-again-btn');

const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundIcon = document.getElementById('sound-icon');

const showStatsBtn = document.getElementById('show-stats-btn');
const statsModal = document.getElementById('stats-modal');
const closeStatsBtn = document.getElementById('close-stats-btn');
const resetStatsBtn = document.getElementById('reset-stats-btn');

// Stats Elements
const statPlayed = document.getElementById('stat-played');
const statWon = document.getElementById('stat-won');
const statWinrate = document.getElementById('stat-winrate');
const bestEasy = document.getElementById('best-easy');
const bestMedium = document.getElementById('best-medium');
const bestHard = document.getElementById('best-hard');

// Web Audio API Synthesizer
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playSound(type) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'high') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'low') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(500, now + 0.2);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'win') {
            // Victory Fanfare
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                const noteOsc = ctx.createOscillator();
                const noteGain = ctx.createGain();
                noteOsc.type = 'sine';
                noteOsc.frequency.setValueAtTime(freq, now + i * 0.1);
                noteGain.gain.setValueAtTime(0.2, now + i * 0.1);
                noteGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.25);
                noteOsc.connect(noteGain);
                noteGain.connect(ctx.destination);
                noteOsc.start(now + i * 0.1);
                noteOsc.stop(now + i * 0.1 + 0.25);
            });
        } else if (type === 'lose') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.4);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        }
    } catch (e) {
        console.warn('Audio play error:', e);
    }
}

// Confetti Particle Effect
const confettiCanvas = document.getElementById('confetti-canvas');
const ctxConfetti = confettiCanvas.getContext('2d');
let particles = [];
let confettiAnimationId = null;

function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function triggerConfetti() {
    particles = [];
    const colors = ['#00f2fe', '#9d50bb', '#10b981', '#f59e0b', '#ef4444', '#ffffff'];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: -10 - Math.random() * 50,
            r: 4 + Math.random() * 6,
            d: Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    updateConfetti();
}

function updateConfetti() {
    ctxConfetti.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let remaining = 0;
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle) * 15;

        if (p.y <= confettiCanvas.height) remaining++;

        ctxConfetti.beginPath();
        ctxConfetti.lineWidth = p.r;
        ctxConfetti.strokeStyle = p.color;
        ctxConfetti.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctxConfetti.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctxConfetti.stroke();
    }

    if (remaining > 0) {
        confettiAnimationId = requestAnimationFrame(updateConfetti);
    } else {
        ctxConfetti.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

function clearConfetti() {
    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    ctxConfetti.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

// Game Logic Initialization
function initGame() {
    secretNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    attemptsLeft = maxAttempts;
    attemptsUsed = 0;
    guessHistory = [];
    gameActive = true;

    rangeText.textContent = `${minNum} to ${maxNum}`;
    attemptsLeftVal.textContent = attemptsLeft;
    updateProgressCircle();

    guessInput.value = '';
    guessInput.focus();
    clearInputError();

    hintContainer.classList.add('hidden');
    resultModal.classList.add('hidden');
    clearConfetti();

    renderHistory();
}

function updateProgressCircle() {
    const percent = (attemptsLeft / maxAttempts) * 100;
    progressCircle.setAttribute('stroke-dasharray', `${percent}, 100`);
    
    if (percent > 50) {
        progressCircle.style.stroke = '#00f2fe';
    } else if (percent > 25) {
        progressCircle.style.stroke = '#f59e0b';
    } else {
        progressCircle.style.stroke = '#ef4444';
    }
}

function showInputError(msg) {
    inputFeedback.textContent = msg;
    inputFeedback.classList.remove('hidden');
    gameCard.classList.add('shake');
    setTimeout(() => gameCard.classList.remove('shake'), 400);
}

function clearInputError() {
    inputFeedback.textContent = '';
    inputFeedback.classList.add('hidden');
}

// Validate & Handle Guess
function handleGuessSubmit() {
    if (!gameActive) return;

    const rawInput = guessInput.value.trim();

    // Input Validation Requirement
    if (rawInput === '') {
        showInputError('Input cannot be empty. Please enter a whole number.');
        return;
    }

    const guess = Number(rawInput);
    if (!Number.isInteger(guess)) {
        showInputError(`'${rawInput}' is not a valid integer. Please enter digits only.`);
        return;
    }

    if (guess < minNum || guess > maxNum) {
        showInputError(`Out of range! Your guess must be between ${minNum} and ${maxNum}.`);
        return;
    }

    clearInputError();
    attemptsUsed++;
    attemptsLeft--;

    attemptsLeftVal.textContent = attemptsLeft;
    updateProgressCircle();

    if (guess === secretNum) {
        // WIN Condition
        playSound('win');
        triggerConfetti();
        addHistoryItem(guess, 'Correct!', 'correct');
        showLatestHint('CORRECT!', `You guessed it in ${attemptsUsed} attempt(s)!`, 'correct');
        endGame(true);
    } else if (guess > secretNum) {
        // TOO HIGH
        playSound('high');
        addHistoryItem(guess, 'Too High', 'too-high');
        showLatestHint('TOO HIGH', `The secret number is lower than ${guess}.`, 'too-high');
        if (attemptsLeft <= 0) {
            endGame(false);
        }
    } else {
        // TOO LOW
        playSound('low');
        addHistoryItem(guess, 'Too Low', 'too-low');
        showLatestHint('TOO LOW', `The secret number is higher than ${guess}.`, 'too-low');
        if (attemptsLeft <= 0) {
            endGame(false);
        }
    }

    guessInput.value = '';
    guessInput.focus();
}

function showLatestHint(badgeText, detailText, type) {
    hintBadge.textContent = badgeText;
    hintDetail.textContent = detailText;
    
    latestHintCard.className = `hint-card ${type}`;
    hintContainer.classList.remove('hidden');
}

function addHistoryItem(guess, statusText, type) {
    guessHistory.unshift({
        attempt: attemptsUsed,
        guess: guess,
        status: statusText,
        type: type
    });
    renderHistory();
}

function renderHistory() {
    attemptBadge.textContent = `${attemptsUsed} / ${maxAttempts} Attempts Used`;

    if (guessHistory.length === 0) {
        emptyHistoryState.classList.remove('hidden');
        historyList.innerHTML = '';
        historyList.appendChild(emptyHistoryState);
        return;
    }

    emptyHistoryState.classList.add('hidden');
    historyList.innerHTML = guessHistory.map(item => `
        <div class="history-item">
            <span class="att-num">Attempt #${item.attempt}</span>
            <span class="val">${item.guess}</span>
            <span class="status-tag ${item.type}">${item.status}</span>
        </div>
    `).join('');
}

function endGame(won) {
    gameActive = false;
    updateStats(won);

    setTimeout(() => {
        resultModal.classList.remove('hidden');
        secretDisplay.textContent = secretNum;

        if (won) {
            resultIcon.textContent = '🎉';
            resultTitle.textContent = 'Victory!';
            resultDesc.textContent = `Excellent! You guessed the secret number in ${attemptsUsed} attempt(s).`;
        } else {
            playSound('lose');
            resultIcon.textContent = '💀';
            resultTitle.textContent = 'Game Over!';
            resultDesc.textContent = `You've used all ${maxAttempts} attempts. Don't worry, try again!`;
        }
    }, 600);
}

// Leaderboard & LocalStorage Stats
const STATS_KEY = 'thinkchamp_number_guessing_stats';

function getStats() {
    try {
        const saved = localStorage.getItem(STATS_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
        played: 0,
        won: 0,
        bestScores: {}
    };
}

function saveStats(stats) {
    try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {}
}

function updateStats(won) {
    const stats = getStats();
    stats.played += 1;
    if (won) {
        stats.won += 1;
        const best = stats.bestScores[currentDiff];
        if (best === undefined || attemptsUsed < best) {
            stats.bestScores[currentDiff] = attemptsUsed;
        }
    }
    saveStats(stats);
}

function renderStatsModal() {
    const stats = getStats();
    statPlayed.textContent = stats.played;
    statWon.textContent = stats.won;
    const rate = stats.played > 0 ? ((stats.won / stats.played) * 100).toFixed(1) : 0;
    statWinrate.textContent = `${rate}%`;

    bestEasy.textContent = stats.bestScores['easy'] ? `${stats.bestScores['easy']} attempts` : '-';
    bestMedium.textContent = stats.bestScores['medium'] ? `${stats.bestScores['medium']} attempts` : '-';
    bestHard.textContent = stats.bestScores['hard'] ? `${stats.bestScores['hard']} attempts` : '-';
}

// Event Listeners
diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        playSound('click');
        diffBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const diffKey = btn.dataset.diff;
        currentDiff = diffKey;

        if (diffKey === 'custom') {
            customCard.classList.remove('hidden');
        } else {
            customCard.classList.add('hidden');
            minNum = DIFFICULTIES[diffKey].min;
            maxNum = DIFFICULTIES[diffKey].max;
            maxAttempts = DIFFICULTIES[diffKey].attempts;
            initGame();
        }
    });
});

applyCustomBtn.addEventListener('click', () => {
    playSound('click');
    const minVal = parseInt(document.getElementById('custom-min').value);
    const maxVal = parseInt(document.getElementById('custom-max').value);
    const attVal = parseInt(document.getElementById('custom-attempts').value);

    if (isNaN(minVal) || isNaN(maxVal) || isNaN(attVal)) {
        alert('Please enter valid numbers for custom settings.');
        return;
    }
    if (minVal >= maxVal) {
        alert('Max number must be greater than Min number!');
        return;
    }
    if (attVal < 1) {
        alert('Attempts must be at least 1!');
        return;
    }

    minNum = minVal;
    maxNum = maxVal;
    maxAttempts = attVal;
    currentDiff = 'custom';
    initGame();
});

guessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleGuessSubmit();
});

playAgainBtn.addEventListener('click', () => {
    playSound('click');
    initGame();
});

soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    playSound('click');
});

showStatsBtn.addEventListener('click', () => {
    playSound('click');
    renderStatsModal();
    statsModal.classList.remove('hidden');
});

closeStatsBtn.addEventListener('click', () => {
    playSound('click');
    statsModal.classList.add('hidden');
});

resetStatsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all game stats & leaderboard records?')) {
        playSound('click');
        localStorage.removeItem(STATS_KEY);
        renderStatsModal();
    }
});

// Initialize on page load
initGame();
