const { Query } = require("pg");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/attendance.db");

// Function to add a class
function addClass(classData, callback) {
  const { class_name, year } = classData;
  const id = `${class_name} (${year})`; // Concatenate class_name and year to form the id

  const query = "INSERT INTO classes (id, year) VALUES (?, ?)";
  db.run(query, [id, year], function (err) {
    if (err) {
      callback(err);
    } else {
      console.log("Executed query: ", query);
      callback(null, { id, year });
    }
  });
}

// Function to add a student
function addStudent(studentData, callback) {
  const { name, student_id, image } = studentData;
  const query = "INSERT INTO students (id, name, image) VALUES (?, ?, ?)";
  db.run(query, [student_id, name, image], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: this.lastID, name, student_id, image });
    }
  });
}

// Function to add student to class
function addStudentClass(studentClassData) {
  return new Promise((resolve, reject) => {
    const { student_id, class_id } = studentClassData;
    const query =
      "SELECT COUNT(*) as count FROM student_classes WHERE student_id = ? AND class_id = ?";

    db.get(query, [student_id, class_id], function (err, result) {
      if (err) {
        reject("Error checking student enrollment: " + err); // Reject with the error
        return;
      }

      if (result.count > 0) {
        reject(new Error("Student has already enrolled in this class.")); // Reject with the custom error
        return;
      }

      const insertQuery =
        "INSERT INTO student_classes (student_id, class_id) VALUES (?, ?)";

      db.run(insertQuery, [student_id, class_id], function (err) {
        if (err) {
          reject("Error inserting student into class: " + err); // Reject on database error
        } else {
          resolve({ student_id, class_id }); // Resolve successfully
        }
      });
    });
  });
}

// Function to add a schedule
function addSchedule(scheduleData, callback) {
  const { class_id, day_of_week, room, start_time, end_time } = scheduleData;
  const query =
    "INSERT INTO schedules (class_id, day_of_week, room, start_time, end_time) VALUES (?, ?, ?, ?, ?)";
  db.run(
    query,
    [class_id, day_of_week, room, start_time, end_time],
    function (err) {
      if (err) {
        callback(err);
      } else {
        callback(null, {
          id: this.lastID,
          class_id,
          day_of_week,
          room,
          start_time,
          end_time,
        });
      }
    }
  );
}

// Function to add a class session
function addClassSession(classSessionData, callback) {
  const { class_id, schedule_id, date, status } = classSessionData;
  const query =
    "INSERT INTO class_sessions (class_id, schedule_id, date, status) VALUES (?, ?, ?, ?)";
  db.run(query, [class_id, schedule_id, date, status], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: this.lastID, class_id, schedule_id, date, status });
    }
  });
}

function updatePresence(studentId) {
  return new Promise((resolve, reject) => {
    const findClassSessionQuery = `
      SELECT id, class_id, created_at
      FROM class_sessions where created_at < datetime('now') 
      AND datetime(created_at, '+2 hours') > datetime('now')
    `;

    db.get(findClassSessionQuery, (err, classSession) => {
      if (err) {
        console.error("Error finding class session:", err);
        reject("Failed to find class session.");
        return;
      }

      if (!classSession) {
        reject("No active class session found within the last 2 hours.");
        return;
      }

      const { id: classSessionId, class_id: classId } = classSession;

      const verifyStudentQuery = `
        SELECT COUNT(*) as count
        FROM student_classes
        WHERE student_id = ? AND class_id = ?;
      `;

      const id = studentId["studentId"];

      db.get(verifyStudentQuery, [id, classId], (err, result) => {
        if (err) {
          console.error("Error verifying student:", err);
          reject("Failed to verify student.");
          return;
        }

        if (result.count === 0) {
          reject("Student does not belong to the active class session.");
          return;
        }

        const checkPresenceQuery = `
          SELECT COUNT(*) as count
          FROM presences
          WHERE class_session_id = ? AND student_id = ? AND status = 'Present';
        `;

        db.get(checkPresenceQuery, [classSessionId, id], (err, result) => {
          if (err) {
            console.error("Error checking presence:", err);
            reject("Failed to check presence.");
            return;
          }

          if (result.count > 0) {
            reject("Student has already been marked present.");
            return;
          }

          const insertPresenceQuery = `
          INSERT INTO presences (class_session_id, student_id, status)
          VALUES (?, ?, 'Present');
        `;

        db.run(insertPresenceQuery, [classSessionId, id], function (err) {
          if (err) {
            console.error("Error inserting presence:", err);
            reject("Failed to record presence.");
          } else {
            const addCountQuery = `UPDATE class_sessions SET presence_count = presence_count + 1 WHERE id = ?`;
            db.run(addCountQuery, [classSessionId], function (err) {
              if (err) {
                console.error("Error updating presence count:", err);
              }
              resolve("Presence recorded successfully.");
            });
          }
        });
        });

        
      });
    });
  });
}

module.exports = {
  addClass,
  addStudent,
  addStudentClass,
  addSchedule,
  addClassSession,
  updatePresence,
};
