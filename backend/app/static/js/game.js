// Game functionality for Trivia Game

document.addEventListener('DOMContentLoaded', function() {
    // Handle answer selection
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    answerButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Disable all buttons after selection
            answerButtons.forEach(btn => {
                btn.disabled = true;
            });
            
            // Submit the form
            document.getElementById('answer-form').submit();
        });
    });
    
    // Timer functionality (if needed)
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        let timeLeft = 15; // seconds
        
        const timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                document.getElementById('answer-form').submit();
            }
        }, 1000);
    }
});