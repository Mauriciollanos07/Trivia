from app.schemas import ma
from app.models.user import User
from marshmallow import fields, ValidationError
import re

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        exclude = ('password_hash',)
        load_instance = True
    
    # Add fields that aren't in the model
    password = fields.String(load_only=True, required=True)
    
    # Use field validation instead of @validates decorator
    email = fields.Email(required=True)
    
    def validate_password(self, value):
        if len(value) < 8:
            raise ValidationError('Password must be at least 8 characters long')
        return value