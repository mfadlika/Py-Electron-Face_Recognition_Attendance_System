import React, { useState, useEffect } from "react";

function AddStudentClassForm() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  // Fetch data from Electron
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedClasses = await window.electron.getClasses();
        const fetchedStudents = await window.electron.getStudents();
        setClasses(fetchedClasses);
        setStudents(fetchedStudents);
        setFilteredStudents(fetchedStudents); // Initially, display all students
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter students based on the search input
  useEffect(() => {
    if (studentSearch === "") {
      setFilteredStudents(students); // If search is empty, show all students
    } else {
      setFilteredStudents(
        students.filter(
          (student) =>
            student.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
            student.name.toLowerCase().includes(studentSearch.toLowerCase())
        )
      );
    }
  }, [studentSearch, students]);

  const handleSubmit = async () => {
    if (!selectedClass || !selectedStudent) {
      alert("Please select a class and a student.");
      return;
    }

    const data = {
      student_id: selectedStudent,
      class_id: selectedClass,
    };

    try {
      await window.electron.addStudentClass(data);
      alert("Student added to class successfully!");
    } catch (error) {
      console.error("Error adding student to class:", error);

      // Handle specific error messages
      if (error instanceof Error) {
        alert("Student has already enrolled in this class");
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  const handleStudentSelection = (student) => {
    setStudentSearch(student.id); // Populate input with selected student ID
    setSelectedStudent(student.id); // Set selected student ID
    setFilteredStudents([]); // Hide dropdown after selection
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Tambah Mahasiswa ke Kelas</h2>

      {/* Class Select */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Class</label>
        <select
          className="border rounded w-full p-2"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">-- Select a Class --</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.id}
            </option>
          ))}
        </select>
      </div>

      {/* Student Search Input */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium mb-1">
          Search Student by ID or Name
        </label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          placeholder="Enter student ID or name"
        />

        {/* Filtered Students List (Dropdown) */}
        {studentSearch && filteredStudents.length > 0 && (
          <ul className="absolute top-full left-0 w-full border border-gray-300 bg-white max-h-40 overflow-auto mt-1">
            {filteredStudents.map((student) => (
              <li
                key={student.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleStudentSelection(student)}
              >
                {student.id} - {student.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Submit
      </button>
    </div>
  );
}

export default AddStudentClassForm;
