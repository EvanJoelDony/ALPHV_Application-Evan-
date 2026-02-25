import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import UserPortal from "./UserPortal";
import AdminPortal from "./AdminPortal";

function App() {
  return (
    <Router>
      <div className="container mt-3">
        <nav className="mb-3">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `btn me-2 ${isActive ? "btn-primary" : "btn-outline-primary"}`
            }
          >
            Admin Portal
          </NavLink>
          <NavLink 
            to="/user" 
            className={({ isActive }) => 
              `btn ${isActive ? "btn-secondary" : "btn-outline-secondary"}`
            }
          >
            User Portal
          </NavLink>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<AdminPortal />} />
        <Route path="/user" element={<UserPortal />} />
        <Route path="*" element={<div className="container mt-4"><div className="alert alert-warning">Page not found</div></div>} />
      </Routes>
    </Router>
  );
}

export default App;