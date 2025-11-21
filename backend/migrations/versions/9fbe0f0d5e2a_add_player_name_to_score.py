"""add player_name to score

Revision ID: 9fbe0f0d5e2a
Revises: 71e2e83d8dad
Create Date: 2025-05-29 21:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9fbe0f0d5e2a'
down_revision = '71e2e83d8dad'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('score') as batch_op:
        batch_op.add_column(sa.Column('player_name', sa.String(length=120), nullable=True))


def downgrade():
    with op.batch_alter_table('score') as batch_op:
        batch_op.drop_column('player_name')
