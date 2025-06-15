const {
  getClasses,
  getStudents,
  getLecturers,
  getStudentsByClass,
  getSchedules,
  getSchedulesByClass,
  getClassSessions,
  getSessionAttendance,
  getClassSessionsCSV,
} = require("../database/getFunctions");
const { parse } = require("json2csv");
const path = require("path");
const fs = require("fs");
const os = require("os"); // Required to access the user's home directory

module.exports = {
  setupGetHandlers(ipcMain) {
    // Handle Classes
    ipcMain.handle("getClasses", async () => {
      return new Promise((resolve, reject) => {
        getClasses((err, classes) => {
          if (err) {
            reject(err);
          } else {
            resolve(classes);
          }
        });
      });
    });

    ipcMain.handle("getStudents", async () => {
      return new Promise((resolve, reject) => {
        getStudents((err, students) => {
          if (err) reject(err);
          else resolve(students);
        });
      });
    });

    ipcMain.handle("getLecturers", async (event) => {
      return new Promise((resolve, reject) => {
        getLecturers((err, lecturers) => {
          if (err) reject(err);
          else resolve(lecturers);
        });
      });
    });

    ipcMain.handle("getStudentsByClass", async (event, classId) => {
      return new Promise((resolve, reject) => {
        getStudentsByClass(classId, (err, newSchedule) => {
          if (err) reject(err);
          else resolve(newSchedule);
        });
      });
    });

    ipcMain.handle("getSchedules", async () => {
      return new Promise((resolve, reject) => {
        getSchedules((err, schedules) => {
          if (err) reject(err);
          else resolve(schedules);
        });
      });
    });

    ipcMain.handle("getSchedulesByClass", async (event, classId) => {
      return new Promise((resolve, reject) => {
        getSchedulesByClass(classId, (err, newSchedule) => {
          if (err) reject(err);
          else resolve(newSchedule);
        });
      });
    });

    ipcMain.handle("getClassSessions", async () => {
      return new Promise((resolve, reject) => {
        getClassSessions((err, classSessions) => {
          if (err) reject(err);
          else resolve(classSessions);
        });
      });
    });

    ipcMain.handle("getSessionAttendance", async (event, sessionId) => {
      try {
        const result = await getSessionAttendance(sessionId);
        return result;
      } catch (error) {
        throw error;
      }
    });
    ipcMain.handle("getClassSessionsCSV", async (event, classSessionId) => {
      try {
        const rows = await getClassSessionsCSV(classSessionId);

        const csv = parse(rows);
        console.log(csv);
        const downloadsFolder = path.join(os.homedir(), "Downloads");
        const fileName = `class_sessions_presence_${Date.now()}.csv`;
        const filePath = path.join(downloadsFolder, fileName); // Save the file as 'class_sessions.csv' in Downloads folder

        console.log(filePath);
        fs.writeFileSync(filePath, csv);
        return filePath;
      } catch (error) {
        console.error("Error generating CSV:", error);
        throw error;
      }
    });
  },
};
