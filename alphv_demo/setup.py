from app import app, db   # import your Flask app and db object

with app.app_context():
    db.create_all()
    print("Tables created successfully!")