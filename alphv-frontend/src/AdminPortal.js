import React, { useEffect, useState } from "react";
import DataForm from "./DataForm";

function AdminPortal() {
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", color: "", shape: "" });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // adjust as needed


  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (!sortConfig.key) return 0;
  
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
  
    // Handle timestamp as Date
    if (sortConfig.key === "timestamp") {
      valA = new Date(valA);
      valB = new Date(valB);
    }
  
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredEntries = sortedEntries.filter(entry =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.shape.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  
  
  const fetchEntries = () => {
    fetch("http://127.0.0.1:5000/data")
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(error => console.error("Error fetching entries:", error));
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditForm({
      name: entry.name,
      color: entry.color,
      shape: entry.shape
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEdit = (id) => {
    if (!editForm.name.trim() || !editForm.color.trim() || !editForm.shape.trim()) {
      setAlert({ type: "danger", message: "All fields must be filled before saving." });
      return;
    }
  
    fetch(`http://127.0.0.1:5000/data/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to update entry");
        }
        return res.json();
      })
      .then(() => {
        setEditingId(null);
        fetchEntries();
        setAlert({ type: "success", message: `Entry ${id} updated successfully!` });
      })
      .catch(() => setAlert({ type: "danger", message: "Error updating entry." }));
  };
  
  
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      fetch(`http://127.0.0.1:5000/data/${id}`, { method: "DELETE" })
        .then(res => {
          if (!res.ok) {
            throw new Error("Failed to delete entry");
          }
          return res.json();
        })
        .then(() => {
          fetchEntries();
          setAlert({ type: "warning", message: `Entry ${id} deleted.` });
        })
        .catch(() => setAlert({ type: "danger", message: "Error deleting entry." }));
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Alphv Demo Frontend</h1>
      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setAlert({ type: "", message: "" })}
            aria-label="Close"
          ></button>
        </div>
      )}
      <DataForm onEntryAdded={fetchEntries} />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name, color, or shape..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th 
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("id")}
            >
              ID {sortConfig.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th 
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("name")}
            >
              Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th 
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("color")}
            >
              Color {sortConfig.key === "color" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th 
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("shape")}
            >
              Shape {sortConfig.key === "shape" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th 
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("timestamp")}
            >
              Timestamp {sortConfig.key === "timestamp" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map(entry => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              {editingId === entry.id ? (
                <>
                  <td><input name="name" value={editForm.name} onChange={handleEditChange} className="form-control form-control-sm" /></td>
                  <td><input name="color" value={editForm.color} onChange={handleEditChange} className="form-control form-control-sm" /></td>
                  <td><input name="shape" value={editForm.shape} onChange={handleEditChange} className="form-control form-control-sm" /></td>
                  <td>{entry.timestamp}</td>
                  <td>
                    <button className="btn btn-success btn-sm" onClick={() => saveEdit(entry.id)}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{entry.name}</td>
                  <td>{entry.color}</td>
                  <td>{entry.shape}</td>
                  <td>{entry.timestamp}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => startEdit(entry)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(entry.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );  
}

export default AdminPortal;

