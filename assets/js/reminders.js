// Reminder System
class ReminderSystem {
    constructor() {
        this.reminderInterval = null;
        this.notificationPermission = false;
        this.init();
    }

    init() {
        this.requestNotificationPermission();
        this.setupPeriodicReminders();
        this.setupSmartReminders();
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission === 'granted';
        }
    }

    setupPeriodicReminders() {
        // Check for reminders every minute
        this.reminderInterval = setInterval(() => {
            this.checkTimeBasedReminders();
        }, 60000);

        // Initial check
        this.checkTimeBasedReminders();
    }

    setupSmartReminders() {
        // Check for smart reminders every 30 minutes
        setInterval(() => {
            this.checkSmartReminders();
        }, 1800000);
    }

    checkTimeBasedReminders() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Only trigger on the hour (minute 0)
        if (currentMinute === 0) {
            const reminder = timeBasedReminders.find(r => r.hour === currentHour);
            if (reminder) {
                this.showReminder(reminder.message, 'time');
                this.sendNotification('Time Reminder', reminder.message);
            }
        }
    }

    checkSmartReminders() {
        if (!window.habitManager || !window.habitManager.habitState) return;
        
        const completedCount = Object.values(window.habitManager.habitState).filter(Boolean).length;
        const totalHabits = 10; // Fixed number
        const completionRate = (completedCount / totalHabits) * 100;
        
        if (completionRate < 30) {
            this.showReminder(
                "Gentle nudge: You're capable of amazing things. What's one small habit you can complete right now?",
                'motivation'
            );
        } else if (completionRate >= 70 && completionRate < 100) {
            this.showReminder(
                "You're doing great! Just a few more habits to complete your perfect day!",
                'encouragement'
            );
        }
    }

    showReminder(message, type = 'general') {
        const reminderSystem = document.getElementById('reminderSystem');
        const reminderText = document.getElementById('reminderText');
        
        if (!reminderSystem || !reminderText) return;
        
        reminderText.textContent = message;
        reminderSystem.classList.add('show');
        
        // Add type-specific styling
        reminderSystem.className = `reminder-system show ${type}`;
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            this.dismissReminder();
        }, 10000);
        
        // Add subtle animation
        reminderSystem.style.animation = 'fadeInRight 0.5s ease-out';
    }

    dismissReminder() {
        const reminderSystem = document.getElementById('reminderSystem');
        if (reminderSystem) {
            reminderSystem.classList.remove('show');
            reminderSystem.style.animation = 'fadeOutRight 0.5s ease-out';
        }
    }

    sendNotification(title, message) {
        if (this.notificationPermission && 'serviceWorker' in navigator) {
            new Notification(title, {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌟</text></svg>',
                badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌟</text></svg>',
                tag: 'habit-reminder',
                requireInteraction: false,
                silent: false
            });
        }
    }

    scheduleCustomReminder(message, delayMinutes) {
        setTimeout(() => {
            this.showReminder(message, 'custom');
            this.sendNotification('Custom Reminder', message);
        }, delayMinutes * 60000);
    }

    createHabitReminder(habitId, delayMinutes = 30) {
        const habit = habitConfig[habitId];
        if (habit) {
            const message = `Don't forget about your ${habit.name}! ${this.getMotivationalTip()}`;
            this.scheduleCustomReminder(message, delayMinutes);
        }
    }

    getMotivationalTip() {
        const tips = [
            "Small steps lead to big changes!",
            "You're building your future self!",
            "Consistency is your superpower!",
            "Every habit completed is a win!",
            "You're stronger than your excuses!",
            "Progress over perfection!",
            "Your future self will thank you!",
            "Champions are built through daily habits!"
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    // Pomodoro-style focused reminders
    startFocusSession(habitId, duration = 25) {
        const habit = habitConfig[habitId];
        if (!habit) return;

        this.showReminder(`Starting ${duration}-minute focus session for ${habit.name}. Let's do this! 🔥`, 'focus');
        
        // Halfway reminder
        setTimeout(() => {
            this.showReminder(`Halfway through your ${habit.name} session! Keep going! 💪`, 'focus');
        }, (duration * 60000) / 2);
        
        // Completion reminder
        setTimeout(() => {
            this.showReminder(`Great job! Your ${habit.name} focus session is complete! 🎉`, 'success');
            this.sendNotification('Focus Session Complete', `You completed your ${habit.name} session!`);
        }, duration * 60000);
    }

    // Weather-based reminders (if you want to add weather API integration later)
    checkWeatherReminders() {
        // Placeholder for weather-based habit reminders
        // Could remind about outdoor workouts on nice days, etc.
    }

    // Time zone aware reminders
    getLocalizedReminder(baseHour) {
        const now = new Date();
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Adjust reminders based on user's timezone
        return baseHour; // Simplified - could be enhanced with timezone logic
    }

    // Habit streak reminders
    checkStreakReminders() {
        const streak = window.habitManager.currentStreak;
        
        if (streak > 0 && streak % 7 === 0) {
            this.showReminder(
                `🔥 Amazing! You're on a ${streak}-day streak! You're building something incredible!`,
                'milestone'
            );
            this.sendNotification('Streak Milestone!', `${streak} days of consistency! Keep it up!`);
        }
    }

    // Smart suggestions based on habit patterns
    suggestNextHabit() {
        const completedHabits = Object.keys(window.habitManager.habitState)
            .filter(key => window.habitManager.habitState[key]);
        const uncompletedHabits = Object.keys(habitConfig)
            .filter(key => !window.habitManager.habitState[key]);
        
        if (uncompletedHabits.length > 0) {
            const suggestion = uncompletedHabits[0];
            const habit = habitConfig[suggestion];
            
            this.showReminder(
                `How about tackling "${habit.name}" next? It only takes ${habit.duration}! 🎯`,
                'suggestion'
            );
        }
    }

    // Evening reflection reminders
    showEveningReflection() {
        const completedCount = Object.values(window.habitManager.habitState).filter(Boolean).length;
        const totalHabits = Object.keys(habitConfig).length;
        
        let message;
        if (completedCount >= 7) {
            message = `🌟 What a day! You completed ${completedCount}/${totalHabits} habits. Take a moment to celebrate your wins!`;
        } else if (completedCount >= 4) {
            message = `💪 Solid effort today with ${completedCount}/${totalHabits} habits! What went well?`;
        } else {
            message = `🌱 Every day is a learning opportunity. You completed ${completedCount}/${totalHabits} habits. What can you improve tomorrow?`;
        }
        
        this.showReminder(message, 'reflection');
    }

    // Dynamic reminder scheduling based on habit completion
    scheduleAdaptiveReminders() {
        const now = new Date();
        const currentHour = now.getHours();
        
        // Morning reminders (6-10 AM)
        if (currentHour >= 6 && currentHour <= 10) {
            if (!window.habitManager.habitState['workout']) {
                this.scheduleCustomReminder("Perfect time for your morning workout! Your body is ready! 💪", 15);
            }
            if (!window.habitManager.habitState['meditation']) {
                this.scheduleCustomReminder("A few minutes of mindfulness can set the tone for your entire day 🧘‍♂️", 30);
            }
        }
        
        // Afternoon reminders (12-17 PM)
        if (currentHour >= 12 && currentHour <= 17) {
            if (!window.habitManager.habitState['reading']) {
                this.scheduleCustomReminder("Lunch break = perfect reading time! Feed your mind 📚", 10);
            }
            if (!window.habitManager.habitState['upskill']) {
                this.scheduleCustomReminder("Afternoon energy is great for learning new skills! 🚀", 20);
            }
        }
        
        // Evening reminders (18-21 PM)
        if (currentHour >= 18 && currentHour <= 21) {
            if (!window.habitManager.habitState['gratitude']) {
                this.scheduleCustomReminder("End your day with gratitude. What made you smile today? 😊", 15);
            }
            if (!window.habitManager.habitState['planning']) {
                this.scheduleCustomReminder("Plan tomorrow today! 5 minutes now saves 50 minutes tomorrow 📋", 25);
            }
        }
    }

    // Habit completion celebrations
    celebrateHabitCompletion(habitId) {
        const habit = habitConfig[habitId];
        const celebrations = [
            `🎉 Yes! You just completed ${habit.name}! You're unstoppable!`,
            `⚡ Amazing! ${habit.name} is done! Feel that momentum building!`,
            `🌟 Boom! Another ${habit.name} in the books! You're on fire!`,
            `🚀 Fantastic! ${habit.name} complete! Your future self is cheering!`,
            `💪 Outstanding! ${habit.name} crushed! That's how winners do it!`
        ];
        
        const message = celebrations[Math.floor(Math.random() * celebrations.length)];
        this.showReminder(message, 'celebration');
    }

    // Gentle nudges for long periods of inactivity
    checkInactivityReminders() {
        const lastActivity = localStorage.getItem('lastHabitCompletion');
        if (lastActivity) {
            const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
            const hoursInactive = timeSinceLastActivity / (1000 * 60 * 60);
            
            if (hoursInactive > 3) {
                this.showReminder(
                    "Hey there! It's been a while. What's one small habit you could tackle right now? 🌱",
                    'gentle-nudge'
                );
            }
        }
    }

    // Custom reminder creation
    createCustomReminder(title, message, time) {
        const reminderTime = new Date(time);
        const now = new Date();
        const delay = reminderTime.getTime() - now.getTime();
        
        if (delay > 0) {
            setTimeout(() => {
                this.showReminder(message, 'custom');
                this.sendNotification(title, message);
            }, delay);
        }
    }

    // Cleanup method
    destroy() {
        if (this.reminderInterval) {
            clearInterval(this.reminderInterval);
        }
    }
}

// Global function for dismissing reminders
function dismissReminder() {
    if (window.reminderSystem) {
        window.reminderSystem.dismissReminder();
    }
}

// Export reminder system
window.ReminderSystem = ReminderSystem;