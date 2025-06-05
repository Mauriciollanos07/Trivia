from app.schemas import ma
from app.models.question import Question
from marshmallow import fields, post_dump

class QuestionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Question
        load_instance = True
    
    # Custom field for incorrect_answers to convert from string to list
    incorrect_answers = fields.Method("get_incorrect_answers", "set_incorrect_answers")
    
    def get_incorrect_answers(self, obj):
        return obj.incorrect_answers.split('|')
    
    def set_incorrect_answers(self, value):
        if isinstance(value, list):
            return '|'.join(value)
        return value