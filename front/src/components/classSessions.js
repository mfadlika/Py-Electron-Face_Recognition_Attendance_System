import React, { useEffect, useState } from "react";

const ClassSessions = ({ classId }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (window.electron) {
      console.log(window.electron); // This should log the electron object with getClassSessions method
      window.electron
        .getClassSessions(classId)
        .then((data) => setSessions(data))
        .catch((error) =>
          console.error("Error fetching class sessions:", error)
        );
    } else {
      console.error("Electron is not available.");
    }
  }, [classId]);

  return (
    <div>
      <h2>Class Sessions for Class {classId}</h2>
      <ul>
        {sessions.length === 0 ? (
          <li>No class sessions found.</li>
        ) : (
          sessions.map((session) => (
            <li key={session.id}>
              {session.date} - {session.status} - {session.attendance_count}{" "}
              students attended
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ClassSessions;
