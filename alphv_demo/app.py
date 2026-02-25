from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone, timedelta
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:admin@localhost/alphv_demo'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define your model
class DataEntry(db.Model):
    __tablename__ = 'data_entries'   # Force table name
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    color = db.Column(db.String(50), nullable=False)
    shape = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

# Route to fetch all data
@app.route("/data", methods=["GET"])
def get_data():
    try:
        entries = DataEntry.query.all()
        result = []
        for entry in entries:
            result.append({
                "id": entry.id,
                "name": entry.name,
                "color": entry.color,
                "shape": entry.shape,
                "timestamp": entry.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# POST route to insert new data
@app.route("/data", methods=["POST"])
def add_data():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    # Validate required fields
    required_fields = ["name", "color", "shape"]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
    
    # Validate fields are not empty or whitespace
    for field in required_fields:
        if not data[field] or not data[field].strip():
            return jsonify({"error": f"Field '{field}' cannot be empty"}), 400
    
    try:
        new_entry = DataEntry(
            name=data["name"].strip(),
            color=data["color"].strip(),
            shape=data["shape"].strip(),
            timestamp=datetime.now(timezone.utc) + timedelta(hours=8)
        )
        db.session.add(new_entry)
        db.session.commit()
        socketio.emit("data_updated")
        return jsonify({"message": "Entry added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# PUT route to update existing data
@app.route("/data/<int:id>", methods=["PUT"])
def update_data(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    try:
        entry = DataEntry.query.get_or_404(id)

        # Track if any changes were made
        changed = False

        # Update fields if provided, with validation
        if "name" in data:
            if not data["name"] or not data["name"].strip():
                return jsonify({"error": "Field 'name' cannot be empty"}), 400
            entry.name = data["name"].strip()
            changed = True
        
        if "color" in data:
            if not data["color"] or not data["color"].strip():
                return jsonify({"error": "Field 'color' cannot be empty"}), 400
            entry.color = data["color"].strip()
            changed = True
        
        if "shape" in data:
            if not data["shape"] or not data["shape"].strip():
                return jsonify({"error": "Field 'shape' cannot be empty"}), 400
            entry.shape = data["shape"].strip()
            changed = True

        # Only update timestamp if data actually changed
        if changed:
            entry.timestamp = datetime.now(timezone.utc) + timedelta(hours=8)
            db.session.commit()
            socketio.emit("data_updated")
            return jsonify({"message": f"Entry {id} updated successfully!"})
        else:
            return jsonify({"message": "No changes provided"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# DELETE route to delete existing data
@app.route("/data/<int:id>", methods=["DELETE"])
def delete_data(id):
    try:
        entry = DataEntry.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        socketio.emit("data_updated")
        return jsonify({"message": f"Entry {id} deleted successfully!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    socketio.run(app, debug=True)