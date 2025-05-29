import json
import random
from app import create_app, db
from app.models.question import Question

def try_questions():
    app = create_app()
    with app.app_context():
        # Get total question count
        total_questions = Question.query.count()
        if total_questions == 0:
            print("No questions found in the database. Please add questions first.")
            return
        
        print(f"Found {total_questions} questions in the database.")
        
        # Ask how many questions to try
        try:
            num_questions = int(input("How many questions would you like to try? "))
            if num_questions <= 0:
                print("Please enter a positive number.")
                return
            num_questions = min(num_questions, total_questions)
        except ValueError:
            print("Please enter a valid number.")
            return
        
        # Get random questions
        questions = Question.query.order_by(db.func.random()).limit(num_questions).all()
        
        score = 0
        for i, question in enumerate(questions, 1):
            print(f"\nQuestion {i}/{num_questions} ({question.category}, Difficulty: {question.difficulty}):")
            print(question.text)
            
            # Prepare answer options
            correct_answer = question.correct_answer
            incorrect_answers = json.loads(question.incorrect_answers)
            all_options = [correct_answer] + incorrect_answers
            random.shuffle(all_options)
            
            # Display options
            for j, option in enumerate(all_options, 1):
                print(f"{j}. {option}")
            
            # Get user answer
            try:
                user_choice = int(input("\nYour answer (1-4): "))
                if 1 <= user_choice <= 4:
                    if all_options[user_choice-1] == correct_answer:
                        print("Correct!")
                        score += 1
                    else:
                        print(f"Wrong! The correct answer is: {correct_answer}")
                else:
                    print("Invalid choice. Skipping question.")
            except ValueError:
                print("Invalid input. Skipping question.")
        
        # Show final score
        print(f"\nFinal score: {score}/{num_questions} ({score/num_questions*100:.1f}%)")

if __name__ == "__main__":
    try_questions()