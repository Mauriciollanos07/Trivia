import json
import random
from app import create_app, db
from app.models.question import Question

# Sample categories
categories = [
    "Science", "History", "Geography", "Entertainment", "Sports",
    "Art", "Literature", "Technology", "Music", "Movies"
]

# Function to generate a sample question
def generate_question(index):
    difficulty = random.randint(1, 3)  # 1: Easy, 2: Medium, 3: Hard
    category = random.choice(categories)
    
    # Generate question based on category and difficulty
    if category == "Science":
        if difficulty == 1:
            element = random.choice(['Oxygen', 'Hydrogen', 'Carbon', 'Gold', 'Silver'])
            text = f"What is the chemical symbol for {element}?"
            correct = {"Oxygen": "O", "Hydrogen": "H", "Carbon": "C", "Gold": "Au", "Silver": "Ag"}[element]
        elif difficulty == 2:
            property_type = random.choice(['atomic number', 'atomic weight'])
            element = random.choice(['Helium', 'Lithium', 'Nitrogen', 'Neon'])
            text = f"What is the {property_type} of {element}?"
            correct = {"atomic number of Helium": "2", "atomic weight of Helium": "4.0026", 
                      "atomic number of Lithium": "3", "atomic weight of Lithium": "6.94",
                      "atomic number of Nitrogen": "7", "atomic weight of Nitrogen": "14.007",
                      "atomic number of Neon": "10", "atomic weight of Neon": "20.18"}[f"{property_type} of {element}"]
        else:
            achievement = random.choice(['discovered penicillin', 'proposed the theory of relativity', 'developed quantum mechanics', 'discovered radioactivity'])
            text = f"Which scientist {achievement}?"
            correct = {"discovered penicillin": "Alexander Fleming", 
                      "proposed the theory of relativity": "Albert Einstein",
                      "developed quantum mechanics": "Niels Bohr",
                      "discovered radioactivity": "Marie Curie"}[achievement]
    elif category == "History":
        if difficulty == 1:
            event = random.choice(['World War I begin', 'World War II end', 'the American Civil War end', 'the Declaration of Independence get signed'])
            text = f"In what year did {event}?"
            correct = {"World War I begin": "1914", "World War II end": "1945", 
                      "the American Civil War end": "1865", "the Declaration of Independence get signed": "1776"}[event]
        elif difficulty == 2:
            position = random.choice(['first President of the United States', '16th President of the United States', 'leader of the Soviet Union during World War II'])
            text = f"Who was the {position}?"
            correct = {"first President of the United States": "George Washington", 
                      "16th President of the United States": "Abraham Lincoln",
                      "leader of the Soviet Union during World War II": "Joseph Stalin"}[position]
        else:
            treaty_action = random.choice(['ended the Thirty Years War', 'established the League of Nations', 'divided the New World between Spain and Portugal'])
            text = f"Which treaty {treaty_action}?"
            correct = {"ended the Thirty Years War": "Peace of Westphalia", 
                      "established the League of Nations": "Treaty of Versailles",
                      "divided the New World between Spain and Portugal": "Treaty of Tordesillas"}[treaty_action]
    else:
        # Generic questions for other categories
        if difficulty == 1:
            text = f"Simple {category} question #{index}"
            correct = f"Answer to simple {category} question #{index}"
        elif difficulty == 2:
            text = f"Moderate {category} question #{index}"
            correct = f"Answer to moderate {category} question #{index}"
        else:
            text = f"Difficult {category} question #{index}"
            correct = f"Answer to difficult {category} question #{index}"
    
    # Generate incorrect answers
    incorrect_answers = []
    for i in range(3):
        incorrect = f"Incorrect answer {i+1} for question #{index}"
        incorrect_answers.append(incorrect)
    
    return {
        "text": text,
        "category": category,
        "difficulty": difficulty,
        "correct_answer": correct,
        "incorrect_answers": json.dumps(incorrect_answers)
    }

def add_sample_questions():
    app = create_app()
    with app.app_context():
        # Check if questions already exist
        existing_count = Question.query.count()
        if existing_count > 0:
            print(f"{existing_count} questions already exist in the database.")
            response = input("Do you want to add 100 more questions? (y/n): ")
            if response.lower() != 'y':
                return
        
        # Add 100 sample questions
        for i in range(1, 101):
            question_data = generate_question(i)
            question = Question(
                text=question_data["text"],
                category=question_data["category"],
                difficulty=question_data["difficulty"],
                correct_answer=question_data["correct_answer"],
                incorrect_answers=question_data["incorrect_answers"]
            )
            db.session.add(question)
            
            # Commit in batches to avoid memory issues
            if i % 10 == 0:
                db.session.commit()
                print(f"Added {i} questions so far...")
        
        # Final commit for any remaining questions
        db.session.commit()
        print("Successfully added 100 sample questions to the database!")

if __name__ == "__main__":
    add_sample_questions()