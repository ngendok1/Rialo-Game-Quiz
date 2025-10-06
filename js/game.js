class RialoGame {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.playerName = "";
        this.userAnswers = new Array(questions.length).fill(null);
        this.startTime = null;
        this.endTime = null;
        
        this.initializeGame();
        this.preloadImages();
    }

    preloadImages() {
        // Preload background image
        const bgImage = new Image();
        bgImage.src = 'assets/images/background.jpg';
        bgImage.onerror = () => {
            console.log('Background image not found, using gradient fallback');
            document.querySelector('.background').style.background = 'linear-gradient(135deg, var(--darker), var(--dark))';
        };

        // Preload logo
        const logoImage = new Image();
        logoImage.src = 'assets/images/logo.png';
        logoImage.onerror = () => {
            console.log('Logo image not found, using text fallback');
        };
    }

    initializeGame() {
        // Get DOM elements
        this.screens = {
            start: document.getElementById('startScreen'),
            quiz: document.getElementById('quizScreen'),
            result: document.getElementById('resultScreen')
        };

        this.elements = {
            playerName: document.getElementById('playerName'),
            startBtn: document.getElementById('startBtn'),
            playerInfo: document.getElementById('playerInfo'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            currentScore: document.getElementById('currentScore'),
            questionText: document.getElementById('questionText'),
            questionNumber: document.getElementById('questionNumber'),
            optionsContainer: document.getElementById('optionsContainer'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            finalScore: document.getElementById('finalScore'),
            resultSubtitle: document.getElementById('resultSubtitle'),
            achievementCard: document.getElementById('achievementCard'),
            achievementIcon: document.getElementById('achievementIcon'),
            achievementTitle: document.getElementById('achievementTitle'),
            achievementDesc: document.getElementById('achievementDesc'),
            correctCount: document.getElementById('correctCount'),
            totalCount: document.getElementById('totalCount'),
            percentage: document.getElementById('percentage'),
            timeTaken: document.getElementById('timeTaken'),
            performanceMessage: document.getElementById('performanceMessage'),
            restartBtn: document.getElementById('restartBtn')
        };

        this.setupEventListeners();
        this.showScreen('start');
    }

    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.elements.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());

        // Enter key to start
        this.elements.playerName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });

        // Add input animation
        this.elements.playerName.addEventListener('focus', () => {
            this.elements.playerName.parentElement.classList.add('focused');
        });

        this.elements.playerName.addEventListener('blur', () => {
            this.elements.playerName.parentElement.classList.remove('focused');
        });
    }

    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        this.screens[screenName].classList.add('active');
    }

    startGame() {
        const name = this.elements.playerName.value.trim();
        if (!name) {
            this.showError('Please enter your name to start the quiz!');
            return;
        }

        if (name.length < 2) {
            this.showError('Please enter a valid name (at least 2 characters)');
            return;
        }

        this.playerName = name;
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers.fill(null);
        this.startTime = new Date();

        this.elements.playerInfo.textContent = this.playerName;
        this.elements.currentScore.textContent = '0';
        
        this.showScreen('quiz');
        this.loadQuestion();
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
            </div>
        `;
        
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(errorDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    loadQuestion() {
        const question = questions[this.currentQuestion];
        
        // Update progress
        const progress = ((this.currentQuestion + 1) / questions.length) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.progressText.textContent = `${this.currentQuestion + 1}/${questions.length}`;
        this.elements.questionNumber.textContent = this.currentQuestion + 1;
        
        // Update question
        this.elements.questionText.textContent = question.question;
        
        // Update options
        this.renderOptions(question);
        
        // Update navigation
        this.elements.prevBtn.disabled = this.currentQuestion === 0;
        this.elements.nextBtn.textContent = this.currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question';
        
        // Add question animation
        this.elements.questionText.style.animation = 'none';
        setTimeout(() => {
            this.elements.questionText.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    }

    renderOptions(question) {
        this.elements.optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.setAttribute('data-letter', String.fromCharCode(65 + index));
            
            // Mark selected answer
            if (this.userAnswers[this.currentQuestion] === index) {
                optionElement.classList.add('selected');
            }
            
            optionElement.textContent = option;
            
            optionElement.addEventListener('click', () => {
                this.selectAnswer(index);
            });
            
            this.elements.optionsContainer.appendChild(optionElement);
        });
    }

    selectAnswer(optionIndex) {
        // Remove previous selections
        const options = this.elements.optionsContainer.querySelectorAll('.option');
        options.forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Mark new selection
        this.userAnswers[this.currentQuestion] = optionIndex;
        options[optionIndex].classList.add('selected');
        
        // Check if answer is correct
        const isCorrect = optionIndex === questions[this.currentQuestion].answer;
        
        // Update score if correct and not previously scored
        if (isCorrect) {
            this.score++;
            this.elements.currentScore.textContent = this.score;
            options[optionIndex].classList.add('correct');
            
            // Add score animation
            this.elements.currentScore.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.elements.currentScore.style.transform = 'scale(1)';
            }, 300);
        } else {
            options[optionIndex].classList.add('incorrect');
            // Show correct answer
            options[questions[this.currentQuestion].answer].classList.add('correct');
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.loadQuestion();
        }
    }

    nextQuestion() {
        if (this.userAnswers[this.currentQuestion] === null) {
            this.showError('Please select an answer before continuing!');
            return;
        }

        if (this.currentQuestion < questions.length - 1) {
            this.currentQuestion++;
            this.loadQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        this.endTime = new Date();
        
        // Calculate final score
        let finalScore = 0;
        for (let i = 0; i < questions.length; i++) {
            if (this.userAnswers[i] === questions[i].answer) {
                finalScore++;
            }
        }
        this.score = finalScore;
        
        const percentage = Math.round((this.score / questions.length) * 100);
        const timeTaken = Math.round((this.endTime - this.startTime) / 1000);
        
        // Update result screen
        this.elements.finalScore.textContent = `${percentage}%`;
        this.elements.resultSubtitle.textContent = `Congratulations, ${this.playerName}!`;
        this.elements.correctCount.textContent = this.score;
        this.elements.totalCount.textContent = questions.length;
        this.elements.percentage.textContent = `${percentage}%`;
        this.elements.timeTaken.textContent = `${timeTaken}s`;
        
        // Set achievement and performance message
        this.setAchievement(percentage);
        this.setPerformanceMessage(percentage);
        
        // Show result screen
        this.showScreen('result');
    }

    setAchievement(percentage) {
        let achievement = {};
        
        if (percentage >= 90) {
            achievement = {
                icon: '🏆',
                title: 'Rialo Master',
                desc: 'Outstanding blockchain expertise!',
                color: 'linear-gradient(135deg, #ffd700, #ffed4e)'
            };
        } else if (percentage >= 70) {
            achievement = {
                icon: '⭐',
                title: 'Rialo Expert',
                desc: 'Excellent blockchain knowledge!',
                color: 'linear-gradient(135deg, #c0c0c0, #e0e0e0)'
            };
        } else if (percentage >= 50) {
            achievement = {
                icon: '📚',
                title: 'Rialo Learner',
                desc: 'Good understanding of Rialo!',
                color: 'linear-gradient(135deg, #cd7f32, #e69c4e)'
            };
        } else {
            achievement = {
                icon: '🌱',
                title: 'Rialo Beginner',
                desc: 'Keep exploring blockchain technology!',
                color: 'linear-gradient(135deg, var(--primary), var(--secondary))'
            };
        }
        
        this.elements.achievementIcon.textContent = achievement.icon;
        this.elements.achievementTitle.textContent = achievement.title;
        this.elements.achievementDesc.textContent = achievement.desc;
        this.elements.achievementCard.style.background = achievement.color;
    }

    setPerformanceMessage(percentage) {
        let message = '';
        
        if (percentage >= 90) {
            message = `Outstanding performance! Your deep understanding of Rialo's innovative blockchain technology is truly impressive. You're ready to build the future of Web3!`;
        } else if (percentage >= 70) {
            message = `Great job! You have a solid grasp of Rialo's core concepts and its revolutionary approach to blockchain infrastructure.`;
        } else if (percentage >= 50) {
            message = `Good effort! You're on the right track to mastering Rialo's unique features. Keep exploring to unlock the full potential of blockchain technology.`;
        } else {
            message = `Nice try! Rialo is shaping the future of blockchain with real-world data integration. Continue learning to discover its groundbreaking capabilities.`;
        }
        
        this.elements.performanceMessage.textContent = message;
    }

    restartGame() {
        this.showScreen('start');
        this.elements.playerName.value = '';
        this.elements.playerName.focus();
        
        // Reset animations
        this.elements.currentScore.style.transform = 'scale(1)';
    }
}

// Add CSS for error notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .error-notification {
        font-family: 'Inter', sans-serif;
    }
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .error-icon {
        font-size: 1.2em;
    }
    
    .input-group.focused label {
        color: var(--primary);
    }
`;
document.head.appendChild(style);

// Start the game when page loads
window.addEventListener('load', () => {
    new RialoGame();
});
