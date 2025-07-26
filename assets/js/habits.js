// Habit Management System
class HabitManager {
    constructor() {
        this.habitState = {};
        this.totalPoints = parseInt(localStorage.getItem('totalPoints') || '0');
        this.currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
        this.lastCompletedDate = localStorage.getItem('lastCompletedDate');
        this.init();
    }

    init() {
        this.loadTodaysProgress();
        this.updateStats();
    }

    toggleHabit(element, habitId, points) {
        const checkbox = element.querySelector('.habit-checkbox');
        const isCompleted = checkbox.classList.contains('checked');
        
        if (!isCompleted) {
            this.completeHabit(element, habitId, points);
        } else {
            this.uncompleteHabit(element, habitId, points);
        }
    }

    completeHabit(element, habitId, points) {
        const checkbox = element.querySelector('.habit-checkbox');
        
        // Update UI
        checkbox.classList.add('checked');
        element.classList.add('completed');
        
        // Update state
        this.habitState[habitId] = true;
        this.totalPoints += points;
        
        // Celebration effects
        this.createCelebrationEffect(element);
        this.createSparkles(element);
        this.showMotivationalMessage();
        
        // Play success sound (if audio is enabled)
        this.playSuccessSound();
        
        // Save and update
        this.saveProgress();
        this.updateStats();
        this.checkForAchievements();
    }

    uncompleteHabit(element, habitId, points) {
        const checkbox = element.querySelector('.habit-checkbox');
        
        // Update UI
        checkbox.classList.remove('checked');
        element.classList.remove('completed');
        
        // Update state
        this.habitState[habitId] = false;
        this.totalPoints = Math.max(0, this.totalPoints - points);
        
        // Show gentle reminder
        this.showGentleReminder();
        
        // Save and update
        this.saveProgress();
        this.updateStats();
    }

    createCelebrationEffect(element) {
        const celebration = document.createElement('div');
        celebration.innerHTML = '✨';
        celebration.style.cssText = `
            position: absolute;
            font-size: 2em;
            pointer-events: none;
            z-index: 100;
            animation: float 2s ease-out forwards;
        `;
        
        const rect = element.getBoundingClientRect();
        celebration.style.left = (rect.right - 20) + 'px';
        celebration.style.top = (rect.top + rect.height / 2) + 'px';
        
        document.body.appendChild(celebration);
        setTimeout(() => celebration.remove(), 2000);
    }

    createSparkles(element) {
        const sparkleCount = 5;
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < sparkleCount; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
                sparkle.style.top = (rect.top + rect.height / 2) + 'px';
                
                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1500);
            }, i * 100);
        }
    }

    showMotivationalMessage() {
        const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        
        const celebrationIcon = document.getElementById('celebrationIcon');
        const popupTitle = document.getElementById('popupTitle');
        const popupMessage = document.getElementById('popupMessage');
        
        if (celebrationIcon) celebrationIcon.textContent = message.icon;
        if (popupTitle) popupTitle.textContent = message.title;
        if (popupMessage) popupMessage.textContent = message.message;
        
        this.showPopup();
    }

    showGentleReminder() {
        const reminder = gentleReminders[Math.floor(Math.random() * gentleReminders.length)];
        
        const celebrationIcon = document.getElementById('celebrationIcon');
        const popupTitle = document.getElementById('popupTitle');
        const popupMessage = document.getElementById('popupMessage');
        
        if (celebrationIcon) celebrationIcon.textContent = '💙';
        if (popupTitle) popupTitle.textContent = 'Gentle Reminder';
        if (popupMessage) popupMessage.textContent = reminder;
        
        this.showPopup();
    }

    showPopup() {
        const overlay = document.getElementById('popupOverlay');
        const popup = document.getElementById('motivationalPopup');
        
        if (overlay && popup) {
            overlay.classList.add('show');
            popup.classList.add('show');
        }
    }

    closePopup() {
        const overlay = document.getElementById('popupOverlay');
        const popup = document.getElementById('motivationalPopup');
        
        if (overlay && popup) {
            overlay.classList.remove('show');
            popup.classList.remove('show');
        }
    }

    updateStats() {
        const completedCount = Object.values(this.habitState).filter(Boolean).length;
        const totalHabits = Object.keys(habitConfig).length;
        const progressPercent = Math.round((completedCount / totalHabits) * 100);
        
        // Update stat cards
        const completedElement = document.getElementById('completedHabits');
        const pointsElement = document.getElementById('totalPoints');
        const streakElement = document.getElementById('streakCount');
        const streakDisplayElement = document.getElementById('streakDisplay');
        
        if (completedElement) completedElement.textContent = completedCount;
        if (pointsElement) pointsElement.textContent = this.totalPoints;
        if (streakElement) streakElement.textContent = this.currentStreak;
        if (streakDisplayElement) streakDisplayElement.textContent = this.currentStreak;
        
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = progressPercent + '%';
            progressFill.textContent = progressPercent + '%';
            
            // Add glow effect when progress is high
            if (progressPercent >= 70) {
                progressFill.style.animation = 'progressGlow 2s infinite';
            } else {
                progressFill.style.animation = 'none';
            }
        }
    }

    checkForAchievements() {
        if (!achievementLevels || achievementLevels.length === 0) return;
        
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();
        
        if (nextLevel && this.totalPoints >= nextLevel.points) {
            this.showAchievementUnlocked(nextLevel);
        }
    }

    getCurrentLevel() {
        if (!achievementLevels || achievementLevels.length === 0) return null;
        
        return achievementLevels
            .filter(level => this.totalPoints >= level.points)
            .pop() || achievementLevels[0];
    }

    getNextLevel() {
        if (!achievementLevels || achievementLevels.length === 0) return null;
        
        return achievementLevels.find(level => this.totalPoints < level.points);
    }

    showAchievementUnlocked(level) {
        const celebrationIcon = document.getElementById('celebrationIcon');
        const popupTitle = document.getElementById('popupTitle');
        const popupMessage = document.getElementById('popupMessage');
        
        if (celebrationIcon) celebrationIcon.textContent = level.emoji;
        if (popupTitle) popupTitle.textContent = `Level Up! ${level.level}`;
        if (popupMessage) popupMessage.textContent = `🎉 You've reached ${level.title}! You now have ${this.totalPoints} points!`;
        
        this.showPopup();
        this.playAchievementSound();
    }

    completeDay() {
        const completedCount = Object.values(this.habitState).filter(Boolean).length;
        const totalHabits = 10; // Fixed number since we know we have 10 habits
        const completionRate = (completedCount / totalHabits) * 100;
        
        const celebrationIcon = document.getElementById('celebrationIcon');
        const popupTitle = document.getElementById('popupTitle');
        const popupMessage = document.getElementById('popupMessage');
        
        if (completionRate >= 70) {
            this.currentStreak++;
            localStorage.setItem('lastCompletedDate', new Date().toDateString());
            
            // Bonus points for day completion
            this.totalPoints += 50;
            
            if (celebrationIcon) celebrationIcon.textContent = '🏆';
            if (popupTitle) popupTitle.textContent = 'Day Completed!';
            if (popupMessage) popupMessage.textContent = 
                `Incredible! You completed ${completedCount}/${totalHabits} habits (${Math.round(completionRate)}%). Your streak is now ${this.currentStreak} days! Bonus: +50 points!`;
        } else {
            if (celebrationIcon) celebrationIcon.textContent = '💪';
            if (popupTitle) popupTitle.textContent = 'Keep Going!';
            if (popupMessage) popupMessage.textContent = 
                `You've completed ${completedCount}/${totalHabits} habits (${Math.round(completionRate)}%). Try to get at least 70% completion to maintain your streak!`;
        }
        
        this.showPopup();
        this.saveProgress();
        this.updateStats();
    }

    resetDay() {
        if (confirm('Are you sure you want to reset today? This will clear all completed habits but keep your total points and streak.')) {
            this.habitState = {};
            
            // Reset UI
            document.querySelectorAll('.habit-checkbox').forEach(checkbox => {
                checkbox.classList.remove('checked');
            });
            document.querySelectorAll('.habit-item').forEach(item => {
                item.classList.remove('completed');
            });
            
            this.saveProgress();
            this.updateStats();
        }
    }

    saveProgress() {
        localStorage.setItem('habitState', JSON.stringify(this.habitState));
        localStorage.setItem('totalPoints', this.totalPoints.toString());
        localStorage.setItem('currentStreak', this.currentStreak.toString());
        localStorage.setItem('lastSaveDate', new Date().toDateString());
    }

    loadTodaysProgress() {
        const today = new Date().toDateString();
        const lastSave = localStorage.getItem('lastSaveDate');
        
        if (lastSave === today) {
            // Same day - restore progress
            const saved = localStorage.getItem('habitState');
            if (saved) {
                this.habitState = JSON.parse(saved);
                this.restoreUIState();
            }
        } else {
            // New day - reset habits but check streak
            this.habitState = {};
            this.checkStreakContinuity();
        }
    }

    restoreUIState() {
        Object.keys(this.habitState).forEach(habitId => {
            if (this.habitState[habitId]) {
                const habitElements = document.querySelectorAll('.habit-item');
                habitElements.forEach(element => {
                    if (element.onclick.toString().includes(habitId)) {
                        element.querySelector('.habit-checkbox').classList.add('checked');
                        element.classList.add('completed');
                    }
                });
            }
        });
    }

    checkStreakContinuity() {
        if (this.lastCompletedDate) {
            const lastCompleted = new Date(this.lastCompletedDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastCompleted.toDateString() !== yesterday.toDateString()) {
                this.currentStreak = 0; // Streak broken
            }
        }
    }

    playSuccessSound() {
        // Simple success sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Fallback if Web Audio API is not supported
            console.log('Audio not supported');
        }
    }

    playAchievementSound() {
        // Achievement sound - more elaborate
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523.25, 659.25, 783.99]; // C, E, G
            
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                }, index * 100);
            });
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    getHabitTip(habitId) {
        const habit = habitConfig[habitId];
        if (habit && habit.tips) {
            return habit.tips[Math.floor(Math.random() * habit.tips.length)];
        }
        return "Keep going! Every small step counts.";
    }

    showHabitTip(habitId) {
        const tip = this.getHabitTip(habitId);
        const habit = habitConfig[habitId];
        
        document.getElementById('celebrationIcon').textContent = '💡';
        document.getElementById('popupTitle').textContent = `Tip for ${habit.name}`;
        document.getElementById('popupMessage').textContent = tip;
        
        this.showPopup();
    }
}

// Global functions for HTML onclick events
function toggleHabit(element, habitId, points) {
    if (window.habitManager) {
        window.habitManager.toggleHabit(element, habitId, points);
    }
}

function completeDay() {
    if (window.habitManager) {
        window.habitManager.completeDay();
    }
}

function resetDay() {
    if (window.habitManager) {
        window.habitManager.resetDay();
    }
}

function closePopup() {
    if (window.habitManager) {
        window.habitManager.closePopup();
    }
}

function showMotivation() {
    if (window.habitManager) {
        window.habitManager.showMotivationalMessage();
    }
}