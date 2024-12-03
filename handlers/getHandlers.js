const {
  getClasses,
  getStudents,
  getStudentsByClass,
  getSchedules,
  getSchedulesByClass,
  getClassSessions,
  getSessionAttendance,
  getClassSessionsCSV,
} = require("../database/getFunctions");
const { parse } = require("json2csv");
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
        const downloadsFolder = path.join(os.homedir(), "Downloads");
        const filePath = path.join(
          downloadsFolder,
          "class_sessions_presence.csv"
        ); // Save the file as 'class_sessions.csv' in Downloads folder
        fs.writeFileSync(filePath, csv);
        return filePath;
      } catch (error) {
        console.error("Error generating CSV:", error);
        throw error;
      }
    });
  },
};