import React, { useState, useEffect } from "react";

function AddScheduleForm() {
  const [scheduleDayOfWeek, setScheduleDayOfWeek] = useState("Monday");
  const [scheduleRoom, setScheduleRoom] = useState("");
  const [scheduleStartTime, setScheduleStartTime] = useState("");
  const [scheduleEndTime, setScheduleEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);

  // Fetch classes from Electron
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        console.log("Fetching classes..."); // Debugging log
        const data = await window.electron.getClasses(); // Fetch existing classes
        console.log("Classes fetched:", data); // Debugging log
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleAddSchedule = async () => {
    if (!selectedClassId) {
      alert("Please select a class first.");
      return;
    }

    if (!scheduleRoom || !scheduleStartTime || !scheduleEndTime) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const newSchedule = {
        class_id: selectedClassId, // Use the selected class ID
        day_of_week: scheduleDayOfWeek,
        room: scheduleRoom,
        start_time: scheduleStartTime,
        end_time: scheduleEndTime,
      };

      await window.electron.addSchedule(newSchedule); // Add schedule via electron
      alert("Schedule added successfully!");
      setScheduleRoom(""); // Reset room input field
      setScheduleStartTime(""); // Reset start time
      setScheduleEndTime(""); // Reset end time
    } catch (error) {
      console.error("Error adding schedule:", error);
      alert("Failed to add schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        Tambah Kelas dan Jadwal Kelas
      </h2>

      {/* Select Class to Add Schedule */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Pilih Kelas untuk Menambah Jadwal
        </h3>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Pilih Kelas</option>
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.id}
              </option>
            ))
          ) : (
            <option value="">No classes available</option>
          )}
        </select>
      </div>

      {/* Add Schedule Form */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Tambah Jadwal Kelas</h3>

        <select
          value={scheduleDayOfWeek}
          onChange={(e) => setScheduleDayOfWeek(e.target.value)}
          className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>

        <input
          type="text"
          value={scheduleRoom}
          onChange={(e) => setScheduleRoom(e.target.value)}
          placeholder="Room"
          className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="time"
          value={scheduleStartTime}
          onChange={(e) => setScheduleStartTime(e.target.value)}
          className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="time"
          value={scheduleEndTime}
          onChange={(e) => setScheduleEndTime(e.target.value)}
          className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleAddSchedule}
          disabled={loading}
          className={`w-full py-3 rounded text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-700"
          }`}
        >
          {loading ? "Menambahkan..." : "Tambah Jadwal Kelas"}
        </button>
      </div>
    </div>
  );
}

export default AddScheduleForm;
