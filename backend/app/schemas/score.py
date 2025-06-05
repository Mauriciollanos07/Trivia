from app.schemas import ma
from app.models.score import Score
from marshmallow import fields

class ScoreSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Score
        load_instance = True
        include_fk = True
    
    # Format date as ISO string
    date = fields.DateTime(format="%Y-%m-%dT%H:%M:%S")
    
    # Include username in serialized output
    username = fields.String(dump_only=True)