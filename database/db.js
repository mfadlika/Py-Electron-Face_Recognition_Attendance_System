const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Path to the SQLite database file
const dbPath = path.join(__dirname, "attendance.db");

const {
  getClasses,
  getStudents,
  getStudentsByClass,
  getSchedules,
  getSchedulesByClass,
  getClassSessions,
  getSessionAttendance,
  getClassSessionsCSV,
} = require("./getFunctions");
const {
  addClass,
  addStudent,
  addStudentClass,
  addSchedule,
  addClassSession,
  updatePresence,
} = require("./postFunctions");

const { updateStudentImages } = require("./imageFunctions");

// Open SQLite database
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      year TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS student_classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      class_id TEXT NOT NULL,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(class_id) REFERENCES classes(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id TEXT NOT NULL,
      day_of_week TEXT CHECK(day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')) NOT NULL,
      room TEXT NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      FOREIGN KEY (class_id) REFERENCES classes (id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS class_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id TEXT NOT NULL,
      schedule_id INTEGER NOT NULL,
      date DATE NOT NULL,
      status TEXT CHECK(status IN ('Held', 'Moved', 'Canceled')) NOT NULL,
      attendance_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes (id),
      FOREIGN KEY (schedule_id) REFERENCES schedules (id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS presences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_session_id INTEGER NOT NULL,
      student_id TEXT NOT NULL,
      status TEXT CHECK(status IN ('Present', 'Absent', 'Late')) NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_session_id) REFERENCES class_sessions (id),
      FOREIGN KEY (student_id) REFERENCES students (id)
    )
  `);
});

module.exports = {
  getClasses,
  getStudents,
  getStudentsByClass,
  getSchedules,
  getSchedulesByClass,
  getClassSessions,
  getSessionAttendance,
  getClassSessionsCSV,

  addClass,
  addStudent,
  addStudentClass,
  addSchedule,
  addClassSession,
  updatePresence,
  updateStudentImages,
};
