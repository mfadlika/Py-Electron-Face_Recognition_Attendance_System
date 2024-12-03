const db = require("./db");

// Function to get all classes
function getClasses(callback) {
  const query = "SELECT * FROM classes";
  db.all(query, (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

// Function to get all students
function getStudents(callback) {
  const query = "SELECT * FROM students";
  db.all(query, (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

// Function to get all schedules BY CLASS
function getStudentsByClass(classId, callback) {
  const query = `
  SELECT students.id, students.name, student_classes.class_id
  FROM student_classes
  JOIN students ON student_classes.student_id = students.id
  WHERE student_classes.class_id = ?;
`;

  db.all(query, [classId], (err, rows) => {
    if (err) {
      callback(err); // If there's an error, pass it to the callback
    } else {
      callback(null, rows); // If successful, pass the rows (schedules) to the callback
    }
  });
}

// Function to get all schedules
function getSchedules(callback) {
  const query = "SELECT * FROM schedules";
  db.all(query, (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

// Function to get all schedules BY CLASS
function getSchedulesByClass(classId, callback) {
  const query = "SELECT * FROM schedules WHERE class_id = ?";

  db.all(query, [classId], (err, rows) => {
    if (err) {
      callback(err); // If there's an error, pass it to the callback
    } else {
      console.log(classId);
      callback(null, rows); // If successful, pass the rows (schedules) to the callback
    }
  });
}

// Function to get all class sessions
function getClassSessions(callback) {
  const query = "SELECT * FROM class_sessions";
  db.all(query, (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

function getSessionAttendance(sessionId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        students.name,
        presences.student_id,
        presences.status
      FROM 
        presences
      LEFT JOIN 
        students 
      ON 
        presences.student_id = students.id
      WHERE 
        presences.class_session_id = ?
    `;

    // Use db.all to get all rows
    db.all(query, [sessionId], (err, rows) => {
      if (err) {
        reject("Error fetching data: " + err.message); // Include the actual error
      } else if (!rows || rows.length === 0) {
        reject("No Data Found"); // Handle case where no data matches
      } else {
        console.log(rows); // Debugging
        resolve(rows); // Return all rows
      }
    });
  });
}

const getClassSessionsCSV = (classSessionId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT 
        students.name,
        presences.student_id,
        presences.status
      FROM 
        presences
      LEFT JOIN 
        students 
      ON 
        presences.student_id = students.id
      WHERE 
        presences.class_session_id = ?`;
    db.all(query, [classSessionId], (err, rows) => {
      if (err) reject(err);
      console.log(rows);
      resolve(rows);
    });
  });
};

module.exports = {
  getClasses,
  getStudents,
  getStudentsByClass,
  getSchedules,
  getClassSessions,
  getSchedulesByClass,
  getSessionAttendance,
  getClassSessionsCSV,
};
