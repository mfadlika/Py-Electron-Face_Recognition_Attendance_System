import React, { useState, useEffect } from "react";
import Modal from "../modal";

function ViewSessionForm() {
  const [classes, setClasses] = useState([]);
  const [classSessions, setClassSessions] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  // Fetching the classes when the component mounts
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

  // Fetching class sessions based on selected class ID
  useEffect(() => {
    if (selectedClassId) {
      const fetchClassSessions = async () => {
        try {
          const data = await window.electron.getClassSessions(selectedClassId);
          setClassSessions(data);
        } catch (error) {
          console.error("Error fetching class sessions:", error);
        }
      };

      fetchClassSessions();
    }
  }, [selectedClassId]);

  // Fetch students for a specific session and show in modal
  const handleAttendanceClick = async (sessionId) => {
    try {
      const students = await window.electron.getSessionAttendance(sessionId);
      setModalContent(students);
      setModalTitle(`Students for Session ${classSessions.find((session) => session.id === sessionId).class_id}`);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching session attendance:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Classes and Class Sessions</h2>

      {/* Dropdown to select class */}
      <div className="mb-4">
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Class</option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.id}
            </option>
          ))}
        </select>
      </div>

      {/* Show class sessions for selected class */}
      {selectedClassId && classSessions.length === 0 ? (
        <p>No class sessions available.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Class ID</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Attendance Count</th>
            </tr>
          </thead>
          <tbody>
            {classSessions.map((session) => (
              <tr key={session.id}>
                <td className="px-4 py-2 border">{session.class_id}</td>
                <td className="px-4 py-2 border">{session.date}</td>
                <td className="px-4 py-2 border">{session.status}</td>
                <td
                  className="px-4 py-2 border text-blue-500 hover:underline cursor-pointer"
                  onClick={() => handleAttendanceClick(session.id)}
                >
                  {session.attendance_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for student attendance */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3 className="text-lg font-bold mb-4">{modalTitle}</h3>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Student ID</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {modalContent.map((student, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.student_id}</td>
                  <td className="border px-4 py-2">{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}
    </div>
  );
}

export default ViewSessionForm;
