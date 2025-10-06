class TimerApp {
    constructor() {
        this.isStopwatchMode = true;
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = 0;
        this.pausedTime = 0;
        this.timerInterval = null;
        
        // Countdown specific
        this.countdownTime = 0;
        this.inputPosition = 0;
        this.inputBuffer = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // HH:MM:SS.mmm
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        // Mode buttons
        this.stopwatchModeBtn = document.getElementById('stopwatchMode');
        this.countdownModeBtn = document.getElementById('countdownMode');
        
        // Display elements
        this.timeDisplay = document.getElementById('timeDisplay');
        this.countdownInput = document.getElementById('countdownInput');
        this.inputDisplay = document.getElementById('inputDisplay');
        
        // Control buttons
        this.startPauseBtn = document.getElementById('startPauseBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.inputClearBtn = document.getElementById('inputClear');
        
        // Numeric pad
        this.numButtons = document.querySelectorAll('.num-btn');
    }

    bindEvents() {
        // Mode switching
        this.stopwatchModeBtn.addEventListener('click', () => this.switchMode(true));
        this.countdownModeBtn.addEventListener('click', () => this.switchMode(false));
        
        // Control buttons
        this.startPauseBtn.addEventListener('click', () => this.toggleStartPause());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.inputClearBtn.addEventListener('click', () => this.clearInput());
        
        // Numeric pad
        this.numButtons.forEach(btn => {
            if (btn.id !== 'inputClear') {
                btn.addEventListener('click', () => this.inputNumber(btn.dataset.number));
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Prevent page unload when timer is running
        window.addEventListener('beforeunload', (e) => {
            if (this.isRunning) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    switchMode(isStopwatch) {
        if (this.isRunning) return; // Don't switch while running
        
        this.isStopwatchMode = isStopwatch;
        
        if (isStopwatch) {
            this.stopwatchModeBtn.classList.add('active');
            this.countdownModeBtn.classList.remove('active');
            this.timeDisplay.style.display = 'block';
            this.countdownInput.style.display = 'none';
            this.resetToZero();
        } else {
            this.countdownModeBtn.classList.add('active');
            this.stopwatchModeBtn.classList.remove('active');
            this.timeDisplay.style.display = 'none';
            this.countdownInput.style.display = 'block';
            this.resetInput();
        }
        
        this.updateButtonStates();
    }

    toggleStartPause() {
        if (this.isStopwatchMode) {
            this.toggleStopwatch();
        } else {
            this.toggleCountdown();
        }
    }

    toggleStopwatch() {
        if (!this.isRunning && !this.isPaused) {
            // Start
            this.startTime = Date.now() - this.pausedTime;
            this.isRunning = true;
            this.isPaused = false;
            this.startPauseBtn.textContent = 'Pause';
            this.startPauseBtn.classList.remove('start-btn');
            this.startPauseBtn.classList.add('pause-btn');
        } else if (this.isRunning) {
            // Pause
            this.pausedTime = Date.now() - this.startTime;
            this.isRunning = false;
            this.isPaused = true;
            this.startPauseBtn.textContent = 'Continue';
            this.startPauseBtn.classList.remove('pause-btn');
            this.startPauseBtn.classList.add('continue-btn');
        } else if (this.isPaused) {
            // Continue
            this.startTime = Date.now() - this.pausedTime;
            this.isRunning = true;
            this.isPaused = false;
            this.startPauseBtn.textContent = 'Pause';
            this.startPauseBtn.classList.remove('continue-btn');
            this.startPauseBtn.classList.add('pause-btn');
        }
        
        this.updateTimer();
    }

    toggleCountdown() {
        if (this.countdownTime === 0) return; // Can't start with zero time
        
        if (!this.isRunning && !this.isPaused) {
            // Start countdown
            this.startTime = Date.now();
            this.isRunning = true;
            this.isPaused = false;
            this.startPauseBtn.textContent = 'Pause';
            this.startPauseBtn.classList.remove('start-btn');
            this.startPauseBtn.classList.add('pause-btn');
        } else if (this.isRunning) {
            // Pause countdown
            this.countdownTime -= Date.now() - this.startTime;
            this.isRunning = false;
            this.isPaused = true;
            this.startPauseBtn.textContent = 'Continue';
            this.startPauseBtn.classList.remove('pause-btn');
            this.startPauseBtn.classList.add('continue-btn');
        } else if (this.isPaused) {
            // Continue countdown
            this.startTime = Date.now();
            this.isRunning = true;
            this.isPaused = false;
            this.startPauseBtn.textContent = 'Pause';
            this.startPauseBtn.classList.remove('continue-btn');
            this.startPauseBtn.classList.add('pause-btn');
        }
        
        this.updateTimer();
    }

    clear() {
        this.stopTimer();
        this.resetToZero();
        this.updateButtonStates();
    }

    resetToZero() {
        this.startTime = 0;
        this.pausedTime = 0;
        this.countdownTime = 0;
        this.updateDisplay();
    }

    resetInput() {
        this.inputPosition = 0;
        this.inputBuffer = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.updateInputDisplay();
    }

    clearInput() {
        this.resetInput();
    }

    inputNumber(num) {
        if (this.isRunning) return; // Don't allow input while running
        
        // Shift existing digits and add new one
        for (let i = 0; i < 8; i++) {
            this.inputBuffer[i] = this.inputBuffer[i + 1];
        }
        this.inputBuffer[8] = parseInt(num);
        
        // Convert buffer to milliseconds
        const hours = this.inputBuffer[0] * 10 + this.inputBuffer[1];
        const minutes = this.inputBuffer[2] * 10 + this.inputBuffer[3];
        const seconds = this.inputBuffer[4] * 10 + this.inputBuffer[5];
        const milliseconds = this.inputBuffer[6] * 100 + this.inputBuffer[7] * 10 + this.inputBuffer[8];
        
        this.countdownTime = (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
        
        this.updateInputDisplay();
        this.updateButtonStates();
    }

    updateInputDisplay() {
        const hours = this.inputBuffer[0] * 10 + this.inputBuffer[1];
        const minutes = this.inputBuffer[2] * 10 + this.inputBuffer[3];
        const seconds = this.inputBuffer[4] * 10 + this.inputBuffer[5];
        const milliseconds = this.inputBuffer[6] * 100 + this.inputBuffer[7] * 10 + this.inputBuffer[8];
        
        this.inputDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    }

    updateTimer() {
        if (this.isRunning) {
            this.timerInterval = setInterval(() => {
                this.updateDisplay();
                
                // Check if countdown reached zero
                if (!this.isStopwatchMode && this.getCurrentTime() <= 0) {
                    this.countdownFinished();
                }
            }, 10);
        } else {
            clearInterval(this.timerInterval);
        }
    }

    stopTimer() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timerInterval);
    }

    getCurrentTime() {
        if (this.isStopwatchMode) {
            if (this.isRunning) {
                return Date.now() - this.startTime;
            } else if (this.isPaused) {
                return this.pausedTime;
            }
            return 0;
        } else {
            if (this.isRunning) {
                return this.countdownTime - (Date.now() - this.startTime);
            } else if (this.isPaused) {
                return this.countdownTime;
            }
            return this.countdownTime;
        }
    }

    updateDisplay() {
        const time = Math.max(0, this.getCurrentTime());
        const formatted = this.formatTime(time);
        
        if (this.isStopwatchMode) {
            this.timeDisplay.innerHTML = 
                `<span class="main-time">${formatted.main}</span><span class="milliseconds">.${formatted.ms}</span>`;
        } else {
            this.inputDisplay.textContent = `${formatted.main}.${formatted.ms}`;
        }
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const ms = Math.floor((milliseconds % 1000) / 10);
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return {
            main: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            ms: ms.toString().padStart(3, '0')
        };
    }

    countdownFinished() {
        this.stopTimer();
        this.resetToZero();
        this.updateButtonStates();
        
        // Show alert and play beep
        alert('Time\'s up!');
        this.playBeep();
    }

    playBeep() {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 2);
    }

    updateButtonStates() {
        if (this.isStopwatchMode) {
            this.startPauseBtn.disabled = false;
            this.startPauseBtn.textContent = this.isRunning ? 'Pause' : (this.isPaused ? 'Continue' : 'Start');
        } else {
            this.startPauseBtn.disabled = this.countdownTime === 0;
            this.startPauseBtn.textContent = this.isRunning ? 'Pause' : (this.isPaused ? 'Continue' : 'Start');
        }
        
        // Update button classes
        this.startPauseBtn.className = 'control-btn';
        if (this.isRunning) {
            this.startPauseBtn.classList.add('pause-btn');
        } else if (this.isPaused) {
            this.startPauseBtn.classList.add('continue-btn');
        } else {
            this.startPauseBtn.classList.add('start-btn');
        }
    }

    handleKeyboard(e) {
        // Prevent default for our handled keys
        const handledKeys = [' ', 'r', 'R', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        if (handledKeys.includes(e.key)) {
            e.preventDefault();
        }
        
        if (e.key === ' ') {
            this.toggleStartPause();
        } else if (e.key.toLowerCase() === 'r') {
            this.clear();
        } else if (/^[0-9]$/.test(e.key)) {
            if (!this.isStopwatchMode && !this.isRunning) {
                this.inputNumber(e.key);
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimerApp();
});