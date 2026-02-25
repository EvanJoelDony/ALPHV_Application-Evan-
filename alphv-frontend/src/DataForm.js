import React, { useState } from "react";

function DataForm({ onEntryAdded }) {
  const [form, setForm] = useState({ name: "", color: "", shape: "" });
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Simple validation
    if (!form.name.trim() || !form.color.trim() || !form.shape.trim()) {
      setAlert({ type: "danger", message: "All fields are required!" });
      return;
    }
  
    fetch("http://127.0.0.1:5000/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `HTTP error! status: ${res.status}`);
        }
        return data;
      })
      .then(() => {
        setForm({ name: "", color: "", shape: "" }); // reset form
        onEntryAdded(); // refresh list
        setAlert({ type: "success", message: "Entry added successfully!" });
      })
      .catch(error => {
        let errorMessage = "Error adding entry. Please try again.";
        if (error.message) {
          errorMessage = error.message;
        } else if (error instanceof TypeError && error.message.includes("fetch")) {
          errorMessage = "Cannot connect to server. Please ensure the backend is running.";
        }
        setAlert({ type: "danger", message: errorMessage });
        console.error("Error adding entry:", error);
      });
  };
  
  
  return (
    <div>
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
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="color"
          placeholder="Color"
          value={form.color}
          onChange={handleChange}
          required
        />
        <input
          name="shape"
          placeholder="Shape"
          value={form.shape}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
}

export default DataForm;