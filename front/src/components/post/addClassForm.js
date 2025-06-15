import React, { useEffect, useState } from "react";

function AddClassForm() {
  const [className, setClassName] = useState("");
  const [year, setYear] = useState(""); // Store year in format: 'year/semester'
  const [semester, setSemester] = useState("1"); // Semester state (1 or 2) with default value of 1
  const [classId, setClassId] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [lecturers, setLecturers] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddClass = async () => {
    if (!className || !year || !semester) {
      // Ensure all fields are filled
      alert("Class name, year, and semester are required.");
      return;
    }

    // Combine year and semester into the format '2024/1' or '2024/2'
    const formattedYear = `${year}/${semester}`;

    setLoading(true);

    try {
      const newClass = {
        classId: classId,
        year: formattedYear,
        name: className,
        lecturer_id: lecturerId,
      };
      await window.electron.addClass(newClass); // Ensure this function exists in Electron
      alert("Class added successfully!");
      setClassName(""); // Clear the input field
      setYear(""); // Clear the year field
      setSemester("1"); // Reset semester to default value 1
    } catch (error) {
      console.error("Error adding class:", error);
      alert("Failed to add class.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        console.log("Fetching classes..."); // Debugging log
        const data = await window.electron.getLecturers(); // Fetch existing classes
        console.log("Lecturers fetched:", data); // Debugging log
        setLecturers(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchLecturers();
  }, []);

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Tambah Kelas</h2>

      {/* Input for Class Name */}
      <input
        type="text"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
        placeholder="ID Kelas"
        className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        placeholder="Nama Kelas"
        className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={lecturerId}
        onChange={(e) => setLecturerId(e.target.value)}
        className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Pilih Dosen</option>
        {lecturers.length > 0 ? (
          lecturers.map((lecturer) => (
            <option key={lecturer.id} value={lecturer.id}>
              {lecturer.name}
            </option>
          ))
        ) : (
          <option value="">No lecturers available</option>
        )}
      </select>

      {/* Container for Year and Semester input side by side */}
      <div className="flex space-x-4 mb-4">
        {/* Input for Year */}
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Tahun"
          className="border border-gray-300 w-1/2 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Dropdown for Semester */}
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border border-gray-300 w-1/2 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </select>
      </div>

      <button
        onClick={handleAddClass}
        disabled={loading}
        className={`w-full py-3 rounded text-white font-semibold ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {loading ? "Menambahkan..." : "Tambah"}
      </button>
    </div>
  );
}

export default AddClassForm;
