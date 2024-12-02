import React, { useState, useEffect } from "react";

function AddSessionForm() {
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionStatus, setSessionStatus] = useState("Held");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch classes
    const fetchClasses = async () => {
      try {
        const data = await window.electron.getClasses(); // Fetch existing classes
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    // Fetch schedules based on the selected class
    const fetchSchedulesByClass = async () => {
      if (selectedClassId) {
        try {
          const data = await window.electron.getSchedulesByClass(
            selectedClassId
          ); // Fetch schedules for the selected class
          setSchedules(data);
        } catch (error) {
          console.error("Error fetching schedules:", error);
        }
      }
    };

    fetchClasses();
    fetchSchedulesByClass();
  }, [selectedClassId]); // Re-fetch schedules when selected class changes

  const handleAddSession = async () => {
    if (!selectedClassId || !selectedScheduleId || !sessionDate) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const newSession = {
        class_id: selectedClassId,
        schedule_id: selectedScheduleId,
        date: sessionDate,
        status: sessionStatus,
        attendance_count: 0,
      };

      await window.electron.addClassSession(newSession); // Add session via Electron
      alert("Session added successfully!");
      setSessionDate(""); // Reset the date field

      setSessionStatus("Held"); // Reset status to default
      setSelectedScheduleId(null); // Reset selected schedule
    } catch (error) {
      console.error("Error adding session:", error);
      alert("Failed to add session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Tambah Sesi Kelas</h2>

      {/* Select Class */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Pilih Kelas</h3>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Pilih Kelas</option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.id}
            </option>
          ))}
        </select>
      </div>

      {/* Select Schedule */}
      {selectedClassId && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Pilih Jadwal Kelas</h3>
          <select
            value={selectedScheduleId}
            onChange={(e) => setSelectedScheduleId(e.target.value)}
            className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih Jadwal</option>
            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.day_of_week} - {schedule.room} ({schedule.start_time}{" "}
                to {schedule.end_time})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add Session Form */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Tambah Sesi Kelas</h3>

        <input
          type="date"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={sessionStatus}
          onChange={(e) => setSessionStatus(e.target.value)}
          className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Held">Held</option>
          <option value="Moved">Moved</option>
          <option value="Canceled">Canceled</option>
        </select>

        <button
          onClick={handleAddSession}
          disabled={loading}
          className={`w-full py-3 rounded text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-700"
          }`}
        >
          {loading ? "Menambahkan..." : "Tambah Sesi Kelas"}
        </button>
      </div>
    </div>
  );
}

export default AddSessionForm;
