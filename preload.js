const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  invoke: (channel, ...args) => {
    // List of allowed channels for security reasons
    const allowedChannels = [
      "runFaceRecognition",
      "getClasses",
      "getStudents",
      "stopFaceRecognition",
      "updatePresence",
      // Add other channels here as needed
    ];

    if (allowedChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    } else {
      throw new Error(`Channel ${channel} is not allowed`);
    }
  },
  addClass: (classData) => ipcRenderer.invoke("addClass", classData),
  addStudent: (studentData) => ipcRenderer.invoke("addStudent", studentData),
  addStudentClass: (studentClassData) =>
    ipcRenderer.invoke("addStudentClass", studentClassData),
  addSchedule: (scheduleData) =>
    ipcRenderer.invoke("addSchedule", scheduleData),
  addClassSession: (classSessionData) =>
    ipcRenderer.invoke("addClassSession", classSessionData),
  getClasses: () => ipcRenderer.invoke("getClasses"),
  getStudents: () => ipcRenderer.invoke("getStudents"),
  getStudentsByClass: (studentData) =>
    ipcRenderer.invoke("getStudentsByClass", studentData),
  getSchedules: () => ipcRenderer.invoke("getSchedules"),
  getSchedulesByClass: (scheduleData) =>
    ipcRenderer.invoke("getSchedulesByClass", scheduleData),
  getClassSessions: () => ipcRenderer.invoke("getClassSessions"),
  getSessionAttendance: (sessionId) =>
    ipcRenderer.invoke("getSessionAttendance", sessionId),
  saveStudentImage: (image, name) =>
    ipcRenderer.invoke("saveStudentImage", image, name),
  updatePresence: (student) => ipcRenderer.invoke("updatePresence", studentId),
  validateAdminPassword: (password) =>
    ipcRenderer.invoke("validateAdminPassword", password),
  changeAdminPassword: (newPassword) =>
    ipcRenderer.invoke("changeAdminPassword", newPassword),
  updateStudentImages: () => ipcRenderer.invoke("updateStudentImages"),
  uploadStudentImages: (folderPath) =>
    ipcRenderer.invoke("uploadStudentImages", folderPath),
  getClassSessionsCSV: (classSessionId) =>
    ipcRenderer.invoke("getClassSessionsCSV", classSessionId),
});
