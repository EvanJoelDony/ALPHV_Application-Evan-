from app import db

class DataEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    color = db.Column(db.String(50), nullable=False)
    shape = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
