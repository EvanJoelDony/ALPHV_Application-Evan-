# ALPHV Demo Web Application

A full-stack web application built with React on the Frontend and Flask + SQLAlchemy on the Backend.
Admins can add, edit, and delete entries (such as names, colors, and shapes), while Users can view the implemented data displayed in real-time.

## TechStack used:
- FrontEnd: React, Bootstrap (UI-Styling), SocketIO client (Real-time features)
- Backend: Python, Flask (web framework), Flask-SQLAlchemy (ORM), Flask-SocketIO (WebSocket/real-time), Flask-CORS (CORS handling)
- Database: MySQL, PyMySQL (driver)

## Features

### Admin Portal
- Add, edit, delete entries
- Input validation
- Alerts for success, warning, and error
- Search, sorting, pagination

### User Portal
- Read-only grid
- Real-time updates via SocketIO

### Backend
- REST API with CRUD endpoints
- SQLAlchemy ORM models
- Error handling and validation

## Prerequisites (Install these first before doing the setup instructions)
- Python 3.12+
- Node.js v16+ (preferably latest)
- MySQL Community Server
- pip (Python package manager)
- npm (Node package manager)

## Setup Instructions

### Backend Setup

1. Clone the repository and navigate to the backend folder:
   cd [file location of alphv_demo] (for example: C:\Users\PC11\OneDrive\Desktop\Alphv_Application\alphv_demo)
2. (Optional but recommended) Create and activate a virtual environment:
   
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
3. Install dependencies:
   pip install flask flask-sqlalchemy flask-socketio flask-cors pymysql

4. Create a MySQL database:
   
   CREATE DATABASE alphv_demo;
      (Or use your preferred MySQL client to create the database)

5. (Optional) Update the database URI in `app.py` with your MySQL credentials:
   # Example:
   app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@localhost:3306/alphv_demo'
 	(No need to follow this step since it updates preemptively, only modify IF the script fails to execute)

6. Initialize the database tables:
   
   python -c "from app import db, app; app.app_context().push(); db.create_all()"
      Or alternatively, run Python interactively:
   
   python
      Then in the Python shell:
  
   from app import db, app
   with app.app_context():
       db.create_all()

7. Start the backend server:
  
   python app.py
      The backend should now be running on `http://127.0.0.1:5000`

### Frontend Setup

1. Navigate to the frontend folder (in a new terminal):
   cd [file location of frontend]
   2. Install dependencies:
   npm install
   3. Start the React App:
   npm start
   4. Open `http://localhost:3000` in your browser.

---

## Bonus Features
- Real-time updates with Flask-SocketIO
- Extensible architecture with React Router
- Deployment-ready structure

## Notes
- Backend runs on port 5000, frontend on port 3000
- Tested locally with MySQL Community Server
- Make sure MySQL service is running before starting the backend
- If you encounter CORS errors, ensure Flask-CORS is properly configured in `app.py`
- Replace database credentials in `app.py` with your own MySQL credentials
- (Optional) Using a virtual environment is recommended to keep dependencies isolated.
If you prefer, you can skip this step and install packages globally