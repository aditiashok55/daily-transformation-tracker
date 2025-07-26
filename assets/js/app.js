// Main Application Controller
class DailyTransformationApp {
    constructor() {
        this.habitManager = null;
        this.reminderSystem = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // Initialize core systems
        this.habitManager = new HabitManager();
        this.reminderSystem = new ReminderSystem();
        
        // Make them globally available
        window.habitManager = this.habitManager;
        window.reminderSystem = this.reminderSystem;
        
        // Set up UI components
        this.setupTimeDisplay();
        this.setupDailyQuote();
        this.setupEventListeners();
        this.setupAnimations();
        
        // Start background processes
        this.startBackgroundTasks();
        
        console.log('Daily Transformation Tracker initialized! 🌟');
    }

    setupTimeDisplay() {
        this.updateTime();
        // Update time every second
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    setupDailyQuote() {
        this.setRandomQuote();
        // Change quote every 4 hours
        setInterval(() => this.setRandomQuote(), 4 * 60 * 60 * 1000);
    }

    setRandomQuote() {
        if (!quotes || quotes.length === 0) return;
        
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        const quoteElement = document.getElementById('dailyQuote');
        
        if (quoteElement) {
            // Fade out, change text, fade in
            quoteElement.style.opacity = '0';
            setTimeout(() => {
                quoteElement.innerHTML = `<h3>"${quote}"</h3>`;
                quoteElement.style.opacity = '1';
            }, 300);
        }
    }

    setupEventListeners() {
        // Popup overlay click
        const popupOverlay = document.getElementById('popupOverlay');
        if (popupOverlay) {
            popupOverlay.addEventListener('click', () => {
                this.habitManager.closePopup();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window beforeunload - save progress
        window.addEventListener('beforeunload', () => {
            if (this.habitManager) {
                this.habitManager.saveProgress();
            }
        });

        // Visibility change - pause/resume timers
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseBackgroundTasks();
            } else {
                this.resumeBackgroundTasks();
            }
        });

        // Context menu for habit items (right-click for tips)
        document.querySelectorAll('.habit-item').forEach((item, index) => {
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const habitId = this.getHabitIdFromElement(item);
                if (habitId && this.habitManager) {
                    this.habitManager.showHabitTip(habitId);
                }
            });
        });
    }

    handleKeyboardShortcuts(e) {
        if (!this.habitManager) return;
        
        // Ctrl/Cmd + Enter: Complete day
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.habitManager.completeDay();
        }
        
        // Escape: Close popup
        if (e.key === 'Escape') {
            this.habitManager.closePopup();
            if (this.reminderSystem) {
                this.reminderSystem.dismissReminder();
            }
        }
        
        // Ctrl/Cmd + R: Reset day (with confirmation)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            this.habitManager.resetDay();
        }
        
        // M: Show motivation
        if (e.key === 'm' || e.key === 'M') {
            this.habitManager.showMotivationalMessage();
        }
    }

    getHabitIdFromElement(element) {
        const onclickStr = element.getAttribute('onclick');
        if (onclickStr) {
            const match = onclickStr.match(/toggleHabit\([^,]+,\s*'([^']+)'/);
            return match ? match[1] : null;
        }
        return null;
    }

    setupAnimations() {
        // Stagger animations for initial load
        this.animateStatsCards();
        this.animateHabitItems();
        
        // Add intersection observer for scroll animations
        this.setupScrollAnimations();
    }

    animateStatsCards() {
        const cards = document.querySelectorAll('.stat-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.classList.add('animate-fade-in-up');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    animateHabitItems() {
        const items = document.querySelectorAll('.habit-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.classList.add('animate-fade-in-left');
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 500 + (index * 50));
        });
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        });

        // Observe sections that should animate on scroll
        document.querySelectorAll('.progress-section').forEach(section => {
            observer.observe(section);
        });
    }

    startBackgroundTasks() {
        // Check for streak reminders every hour
        setInterval(() => {
            this.reminderSystem.checkStreakReminders();
        }, 60 * 60 * 1000);

        // Check for inactivity reminders every 30 minutes
        setInterval(() => {
            this.reminderSystem.checkInactivityReminders();
        }, 30 * 60 * 1000);

        // Schedule adaptive reminders every 2 hours
        setInterval(() => {
            this.reminderSystem.scheduleAdaptiveReminders();
        }, 2 * 60 * 60 * 1000);

        // Evening reflection at 9 PM
        this.scheduleEveningReflection();
    }

    scheduleEveningReflection() {
        const now = new Date();
        const eveningTime = new Date();
        eveningTime.setHours(21, 0, 0, 0); // 9 PM
        
        if (now > eveningTime) {
            eveningTime.setDate(eveningTime.getDate() + 1); // Next day
        }
        
        const timeUntilEvening = eveningTime.getTime() - now.getTime();
        
        setTimeout(() => {
            this.reminderSystem.showEveningReflection();
            // Schedule for next day
            setInterval(() => {
                this.reminderSystem.showEveningReflection();
            }, 24 * 60 * 60 * 1000);
        }, timeUntilEvening);
    }

    pauseBackgroundTasks() {
        // Implement if needed - pause certain operations when tab is not visible
        console.log('App paused');
    }

    resumeBackgroundTasks() {
        // Resume operations when tab becomes visible again
        console.log('App resumed');
        this.habitManager.updateStats(); // Refresh stats in case of changes
    }

    // Utility methods
    showNotification(title, message, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            return new Notification(title, {
                body: message,
                icon: options.icon || this.getAppIcon(),
                tag: options.tag || 'habit-tracker',
                ...options
            });
        }
    }

    getAppIcon() {
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌟</text></svg>';
    }

    // Debug methods for development
    debugInfo() {
        return {
            habitState: this.habitManager.habitState,
            totalPoints: this.habitManager.totalPoints,
            currentStreak: this.habitManager.currentStreak,
            completedToday: Object.values(this.habitManager.habitState).filter(Boolean).length,
            version: '1.0.0'
        };
    }

    exportProgress() {
        const data = {
            habitState: this.habitManager.habitState,
            totalPoints: this.habitManager.totalPoints,
            currentStreak: this.habitManager.currentStreak,
            lastCompletedDate: this.habitManager.lastCompletedDate,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importProgress(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.habitState) this.habitManager.habitState = data.habitState;
            if (data.totalPoints) this.habitManager.totalPoints = data.totalPoints;
            if (data.currentStreak) this.habitManager.currentStreak = data.currentStreak;
            if (data.lastCompletedDate) this.habitManager.lastCompletedDate = data.lastCompletedDate;
            
            this.habitManager.saveProgress();
            this.habitManager.updateStats();
            this.habitManager.restoreUIState();
            
            console.log('Progress imported successfully!');
        } catch (error) {
            console.error('Failed to import progress:', error);
        }
    }
}

// Initialize the app
const app = new DailyTransformationApp();

// Make app globally available for debugging
window.app = app;

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add CSS for dynamic animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .stat-card, .habit-item {
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .daily-quote {
        transition: opacity 0.3s ease;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .stat-card, .habit-item, .daily-quote {
            transition: none;
        }
    }
`;
document.head.appendChild(dynamicStyles);