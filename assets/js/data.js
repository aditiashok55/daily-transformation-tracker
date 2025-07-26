// Motivational quotes from success literature
const quotes = [
    "The compound effect of small habits creates extraordinary results. - Darren Hardy",
    "You do not rise to the level of your goals, you fall to the level of your systems. - James Clear",
    "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
    "The secret to getting ahead is getting started. - Mark Twain",
    "Your future self is counting on the decisions you make today.",
    "Progress, not perfection, is the goal.",
    "Every master was once a disaster. Keep going.",
    "The pain of discipline weighs ounces, but the pain of regret weighs tons.",
    "You are not competing with anyone else. You are competing with who you were yesterday.",
    "Small daily improvements over time lead to stunning results.",
    "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
    "Motivation gets you started. Habit is what keeps you going. - Jim Ryun",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit. - Aristotle",
    "The quality of your life is determined by the quality of your daily rituals. - Robin Sharma",
    "Success is nothing more than a few simple disciplines practiced every day. - Jim Rohn"
];

// Motivational messages for habit completion
const motivationalMessages = [
    { 
        icon: "🎯", 
        title: "Focus Mode Activated!", 
        message: "You're building the habits that will transform your life!" 
    },
    { 
        icon: "⚡", 
        title: "Energy Rising!", 
        message: "Each completed habit charges your personal power!" 
    },
    { 
        icon: "🌱", 
        title: "Growth Happening!", 
        message: "You're literally rewiring your brain for success!" 
    },
    { 
        icon: "🔥", 
        title: "On Fire!", 
        message: "This momentum you're building is unstoppable!" 
    },
    { 
        icon: "💎", 
        title: "Diamond Formation!", 
        message: "Pressure creates diamonds. You're becoming precious!" 
    },
    { 
        icon: "🚀", 
        title: "Lift Off!", 
        message: "Your future self is cheering you on right now!" 
    },
    { 
        icon: "💪", 
        title: "Strength Building!", 
        message: "Every habit completed makes you mentally stronger!" 
    },
    { 
        icon: "🎪", 
        title: "Magic Happening!", 
        message: "You're creating the life you've always dreamed of!" 
    },
    { 
        icon: "🌟", 
        title: "Star Quality!", 
        message: "You're shining brighter with each positive choice!" 
    },
    { 
        icon: "🏆", 
        title: "Champion Mindset!", 
        message: "Winners are made through daily disciplines like this!" 
    }
];

// Gentle reminder messages for uncompleted habits
const gentleReminders = [
    "No worries! Every step back teaches us something. What can you learn from this moment?",
    "It's okay to stumble. The key is to keep moving forward with kindness to yourself.",
    "Remember, progress isn't perfect. You're still on the right path.",
    "This is just a moment, not your whole journey. You've got this!",
    "Self-compassion is part of growth. Be gentle with yourself today.",
    "Every habit you restart is a victory. You're already winning by trying again.",
    "Perfectionism is the enemy of progress. You're doing better than you think.",
    "Tomorrow is a fresh start, but you can restart right now too.",
    "The strongest people know when to be gentle with themselves.",
    "Your worth isn't measured by perfect streaks, but by your commitment to growth."
];

// Time-based reminder messages
const timeBasedReminders = [
    { 
        hour: 6, 
        message: "Good morning, champion! Ready to start your transformation journey today?" 
    },
    { 
        hour: 9, 
        message: "Time to start your self-improvement block! What will you tackle first?" 
    },
    { 
        hour: 10, 
        message: "Morning momentum check! How's your workout or reading going?" 
    },
    { 
        hour: 12, 
        message: "Midday check-in! How are your habits going? Remember to stay hydrated!" 
    },
    { 
        hour: 14, 
        message: "Afternoon energy boost! Perfect time for some upskilling or reading." 
    },
    { 
        hour: 16, 
        message: "3 PM productivity tip: This is a great time for skill development!" 
    },
    { 
        hour: 18, 
        message: "Evening reflection time. What went well today?" 
    },
    { 
        hour: 20, 
        message: "Wind down time. Practice some gratitude and self-care." 
    },
    { 
        hour: 21, 
        message: "Almost bedtime! Did you take a moment for gratitude today?" 
    }
];

// Achievement levels and rewards
const achievementLevels = [
    { points: 0, level: "Beginner", title: "Starting the Journey", emoji: "🌱" },
    { points: 100, level: "Novice", title: "Building Momentum", emoji: "🚀" },
    { points: 300, level: "Apprentice", title: "Developing Discipline", emoji: "💪" },
    { points: 600, level: "Practitioner", title: "Forming Habits", emoji: "⭐" },
    { points: 1000, level: "Expert", title: "Living the System", emoji: "🏆" },
    { points: 1500, level: "Master", title: "Habit Mastery", emoji: "👑" },
    { points: 2500, level: "Legend", title: "Transformation Complete", emoji: "💎" }
];

// Habit configuration with categories and points
const habitConfig = {
    // Self-Improvement Block
    workout: { 
        category: "fitness", 
        points: 25, 
        name: "Morning Workout", 
        duration: "30-60 min",
        tips: ["Start with 10 minutes if you're new", "Consistency beats intensity", "Any movement counts!"]
    },
    reading: { 
        category: "learning", 
        points: 20, 
        name: "Daily Reading", 
        duration: "30 min",
        tips: ["Even 5 pages make a difference", "Audio books count too", "Mix fiction and non-fiction"]
    },
    upskill: { 
        category: "learning", 
        points: 30, 
        name: "Skill Development", 
        duration: "1-2 hours",
        tips: ["Focus on one skill at a time", "Practice beats theory", "Teach others what you learn"]
    },
    meditation: { 
        category: "wellness", 
        points: 15, 
        name: "Mindfulness/Meditation", 
        duration: "15 min",
        tips: ["Start with 5 minutes", "Breathing is enough", "Apps like Headspace help"]
    },
    planning: { 
        category: "productivity", 
        points: 10, 
        name: "Daily Planning", 
        duration: "10 min",
        tips: ["Review yesterday's wins", "Set 3 priorities", "Plan your day the night before"]
    },
    
    // Self-Love & Wellness Block
    water: { 
        category: "health", 
        points: 10, 
        name: "Hydration", 
        duration: "Throughout day",
        tips: ["Carry a water bottle", "Set hourly reminders", "Flavor with lemon or mint"]
    },
    gratitude: { 
        category: "mindset", 
        points: 15, 
        name: "Gratitude Practice", 
        duration: "5 min",
        tips: ["Be specific", "Feel the emotion", "Include small things too"]
    },
    selfcare: { 
        category: "wellness", 
        points: 20, 
        name: "Self-Care Act", 
        duration: "Variable",
        tips: ["Can be as simple as a bath", "Listen to your needs", "Schedule it like an appointment"]
    },
    nutrition: { 
        category: "health", 
        points: 15, 
        name: "Healthy Nutrition", 
        duration: "Per meal",
        tips: ["Add vegetables to every meal", "Prepare healthy snacks", "Hydrate before eating"]
    },
    positivity: { 
        category: "mindset", 
        points: 10, 
        name: "Positive Self-Talk", 
        duration: "Throughout day",
        tips: ["Catch negative thoughts early", "Speak like to a best friend", "Use affirmations"]
    }
};

// Export for use in other modules (if using ES6 modules)
// export { quotes, motivationalMessages, gentleReminders, timeBasedReminders, achievementLevels, habitConfig };