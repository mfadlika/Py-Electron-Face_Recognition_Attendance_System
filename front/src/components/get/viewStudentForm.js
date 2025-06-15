// src/components/ViewStudents.js
import React, { useState, useEffect } from "react";

function ViewStudentForm() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await window.electron.getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Students</h2>
      {students.length === 0 ? (
        <p>No students available.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="sticky top-0 bg-white px-4 py-2 border">
                Student ID
              </th>
              <th className="sticky top-0 bg-white px-4 py-2 border">Name</th>
              <th className="sticky top-0 bg-white px-4 py-2 border">Image</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-2 border">{student.id}</td>
                <td className="px-4 py-2 border">{student.name}</td>

                {student.image ? (
                  <td className="px-4 py-2 border bg-green-500">
                    <span>Image Uploaded</span>
                  </td>
                ) : (
                  <td className="px-4 py-2 border bg-red-500 text-white">
                    <span>No Image</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewStudentForm;
