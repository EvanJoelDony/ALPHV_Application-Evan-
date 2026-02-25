import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function UserPortal() {
  const [entries, setEntries] = useState([]);

  const fetchEntries = () => {
    fetch("http://127.0.0.1:5000/data")
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(error => console.error("Error fetching entries:", error));
  };

  useEffect(() => {
    fetchEntries();

    const socket = io("http://127.0.0.1:5000");
    socket.on("data_updated", () => {
      fetchEntries(); // refresh when backend notifies
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">User Portal</h1>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Timestamp</th>
            <th>Name</th>
            <th>Color</th>
            <th>Shape</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
              <td>{entry.name}</td>
              <td>{entry.color}</td>
              <td>{entry.shape}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserPortal;