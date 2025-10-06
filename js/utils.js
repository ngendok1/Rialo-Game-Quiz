// Utility functions for Rialo Knowledge Game

const Utils = {
    // Format percentage with proper rounding
    formatPercentage: (score, total) => {
        return Math.round((score / total) * 100);
    },

    // Get achievement level based on score
    getAchievementLevel: (percentage) => {
        if (percentage >= 90) return { level: 'Rialo Master!', emoji: '🏆', color: 'linear-gradient(135deg, #ffd700, #ffed4e)' };
        if (percentage >= 70) return { level: 'Rialo Expert!', emoji: '⭐', color: 'linear-gradient(135deg, #c0c0c0, #e0e0e0)' };
        if (percentage >= 50) return { level: 'Rialo Learner', emoji: '📚', color: 'linear-gradient(135deg, #cd7f32, #e69c4e)' };
        return { level: 'Rialo Beginner', emoji: '🌱', color: 'linear-gradient(135deg, #667eea, #764ba2)' };
    },

    // Get performance message based on score and player name
    getPerformanceMessage: (percentage, playerName) => {
        if (percentage >= 90) {
            return `Outstanding performance, ${playerName}! You truly understand Rialo's revolutionary approach to blockchain! 🎉`;
        } else if (percentage >= 70) {
            return `Great job, ${playerName}! You have solid knowledge of Rialo's innovative blockchain technology! 👍`;
        } else if (percentage >= 50) {
            return `Good effort, ${playerName}! You're on your way to mastering Rialo's unique features! 💪`;
        } else {
            return `Nice try, ${playerName}! Keep exploring Rialo - it's shaping the future of blockchain! 📚`;
        }
    },

    // Validate player name
    validatePlayerName: (name) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            return { isValid: false, message: 'Please enter your name to start the quiz!' };
        }
        if (trimmedName.length < 2) {
            return { isValid: false, message: 'Please enter a valid name (at least 2 characters)' };
        }
        if (trimmedName.length > 20) {
            return { isValid: false, message: 'Name must be 20 characters or less' };
        }
        return { isValid: true, message: '' };
    },

    // Calculate progress percentage
    calculateProgress: (current, total) => {
        return ((current + 1) / total) * 100;
    }
};
