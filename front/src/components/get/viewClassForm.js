import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

function ViewClassForm() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await window.electron.getClasses();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Classes</h2>
      {classes.length === 0 ? (
        <p>No classes available.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Class Name</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.id}>
                {/* Link to navigate to students page with classId as query */}
                <td className="px-4 py-2 border">
                  <Link
                    to={`/students?classId=${encodeURIComponent(classItem.id)}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {classItem.id}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewClassForm;
