import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // For accessing query parameters

function StudentsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const classId = params.get("classId"); // Get classId from query string
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await window.electron.getStudentsByClass(classId); // Fetch students for this class
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    if (classId) {
      fetchStudents();
    }
  }, [classId]); // Re-fetch when classId changes

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{classId}</h2>
      {students.length === 0 ? (
        <p>No students enrolled in this class.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Student ID</th>
              <th className="px-4 py-2 border">Name</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-2 border">{student.id}</td>
                <td className="px-4 py-2 border">{student.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentsPage;
