const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {
  addClass,
  addStudent,
  addStudentClass,
  addSchedule,
  addClassSession,
  updatePresence,
  getClasses,
  getStudents,
  getStudentsByClass,
  getSchedules,
  getSchedulesByClass,
  getClassSessions,
  getSessionAttendance,
  updateStudentImages,
  uploadStudentImages,
} = require("./database/db");
const fs = require("fs");
const { execFile } = require("child_process");
const bcrypt = require("bcrypt");
const passwordFile = path.resolve(__dirname, "pw.json");
const { dialog } = require("electron");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Reference to the preload.js file
      nodeIntegration: false, // Ensure this is set to false for security
      contextIsolation: true, // Make sure contextIsolation is enabled
    },
  });

  const isDev = !app.isPackaged;
  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "/front/build/index.html")}`;
  mainWindow.loadURL(startURL);
  mainWindow.on("closed", () => (mainWindow = null));
});

// IPC handler to run the face recognition
let pythonProcess = null;

// Helper: Read hashed password from `pw.json`
function getHashedPassword() {
  if (fs.existsSync(passwordFile)) {
    const data = JSON.parse(fs.readFileSync(passwordFile, "utf8"));
    return data.adminPasswordHash;
  }
  return null;
}

// Helper: Write hashed password to `pw.json`
function saveHashedPassword(newHash) {
  const data = { adminPasswordHash: newHash };
  fs.writeFileSync(passwordFile, JSON.stringify(data, null, 2));
}

// IPC: Validate password
ipcMain.handle("validateAdminPassword", async (event, password) => {
  const hashedPassword = getHashedPassword();
  if (!hashedPassword) {
    console.error("No hashed password found in pw.json");
    return false;
  }

  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    console.error("Error validating password:", error);
    return false;
  }
});

// IPC: Update password
ipcMain.handle("changeAdminPassword", async (event, newPassword) => {
  try {
    const newHash = await bcrypt.hash(newPassword, 10);
    saveHashedPassword(newHash);
    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
});

ipcMain.handle("runFaceRecognition", async (event, imageData) => {
  try {
    // Save the captured frame as a temporary file
    const tempFilePath = path.join(__dirname, "temp_frame.jpg");
    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, "");

    fs.writeFileSync(tempFilePath, base64Data, "base64");

    // Run the Python script for face recognition
    const pythonScriptPath = path.join(
      __dirname,
      "script",
      "face_recognition_service.py"
    );
    const imagesFolder = path.join(__dirname, "database", "images");

    return new Promise((resolve, reject) => {
      // Start the Python script
      pythonProcess = execFile(
        "python3",
        [pythonScriptPath, tempFilePath, imagesFolder],
        (error, stdout, stderr) => {
          if (error) {
            console.error("Python script error:", error);
            reject("Face recognition failed.");
          } else {
            resolve(stdout.trim());
          }
        }
      );
    });
  } catch (error) {
    console.error("Error handling recognition:", error);
    throw new Error("Internal server error.");
  }
});

ipcMain.handle("stopFaceRecognition", () => {
  if (pythonProcess) {
    // Kill the Python process
    pythonProcess.kill("SIGINT");
    pythonProcess = null;
    console.log("Face recognition stopped.");
  } else {
    console.log("No active face recognition process to stop.");
  }
});

ipcMain.handle("saveStudentImage", (event, imageData, name) => {
  // Match the image format from the base64 data
  const imageTypeMatch = imageData.match(/^data:image\/(png|jpeg|jpg);base64,/);
  if (!imageTypeMatch) {
    console.error("Unsupported image format");
    return;
  }

  const imageType = imageTypeMatch[1]; // This will be either 'png', 'jpeg', or 'jpg'
  const base64Data = imageData.replace(
    /^data:image\/(png|jpeg|jpg);base64,/,
    ""
  );

  // Determine file extension based on image type
  const fileExtension = imageType === "jpeg" ? "jpg" : imageType;

  // Define the file path where the image will be saved
  const filePath = path.join(
    __dirname,
    "database",
    "images",
    `${name}.${fileExtension}`
  );

  const filePathDB = path.join(
    "database",
    "images",
    `${name}.${fileExtension}`
  );

  // Check if a file with the same name already exists
  if (fs.existsSync(filePath)) {
    console.error(
      `Error: File with name ${name} already exists in the folder.`
    );
    return; // Prevent saving the image and return failure
  }

  // Write the image file to the disk
  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error saving image:", err);
      return;
    }
    console.log("Image saved to", filePath);
  });

  return filePathDB; // Return file path for saving in the database
});

// IPC handlers to add data to the database
ipcMain.handle("addClass", async (event, classData) => {
  return new Promise((resolve, reject) => {
    addClass(classData, (err, newClass) => {
      if (err) reject(err);
      else resolve(newClass);
    });
  });
});

ipcMain.handle("addStudent", async (event, studentData) => {
  return new Promise((resolve, reject) => {
    addStudent(studentData, (err, newStudent) => {
      if (err) reject(err);
      else resolve(newStudent);
    });
  });
});

ipcMain.handle("addStudentClass", async (event, studentClassData) => {
  try {
    const result = await addStudentClass(studentClassData);
    return result;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("addSchedule", async (event, scheduleData) => {
  return new Promise((resolve, reject) => {
    addSchedule(scheduleData, (err, newSchedule) => {
      if (err) reject(err);
      else resolve(newSchedule);
    });
  });
});

ipcMain.handle("addClassSession", async (event, classSessionData) => {
  return new Promise((resolve, reject) => {
    addClassSession(classSessionData, (err, newClassSession) => {
      if (err) reject(err);
      else resolve(newClassSession);
    });
  });
});

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

ipcMain.handle("updatePresence", async (event, studentId) => {
  try {
    const result = await updatePresence(studentId);
    return result;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("updateStudentImages", async (event, studentId) => {
  try {
    const result = await updateStudentImages();
    return result;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle("uploadStudentImages", (event, folderFiles) => {
  return new Promise((resolve, reject) => {
    const savedImages = [];

    folderFiles.forEach((file) => {
      // Check if file.data exists (make sure it's not undefined)
      if (!file.data) {
        console.error(`No data found for file: ${file.name}`);
        return reject(new Error(`File data for ${file.name} is undefined`));
      }

      // Extract image type (e.g., png, jpeg, jpg)
      const imageTypeMatch = file.data.match(
        /^data:image\/(png|jpeg|jpg);base64,/
      );
      if (!imageTypeMatch) {
        console.error(`Unsupported image format for file: ${file.name}`);
        return reject(new Error(`Unsupported image format for ${file.name}`));
      }

      const imageType = imageTypeMatch[1]; // This will be 'png', 'jpeg', or 'jpg'
      const base64Data = file.data.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        ""
      ); // Clean the base64 data

      // Determine file extension based on the image type
      const fileExtension = imageType === "jpeg" ? "jpg" : imageType;

      // Extract the base name of the file (excluding the extension)
      const fileBaseName = path.parse(file.name).name;

      // Define the file path where the image will be saved
      const filePath = path.join(
        __dirname,
        "database",
        "images",
        `${fileBaseName}.${fileExtension}` // Save the file with the proper extension
      );
      const filePathDB = path.join(
        "database",
        "images",
        `${fileBaseName}.${fileExtension}`
      );

      // Check if a file with the same name (excluding extension) already exists
      const filesInDirectory = fs.readdirSync(
        path.join(__dirname, "database", "images")
      );
      const fileExists = filesInDirectory.some((existingFile) => {
        const existingBaseName = path.parse(existingFile).name;
        return existingBaseName === fileBaseName;
      });

      if (fileExists) {
        console.error(
          `Error: File with name ${fileBaseName} (excluding extension) already exists in the folder.`
        );
        return reject(new Error(`File ${fileBaseName} already exists`)); // Prevent saving and reject the promise
      }

      // Write the image file to the disk
      fs.writeFile(filePath, base64Data, "base64", (err) => {
        if (err) {
          console.error("Error saving image:", err);
          return reject(err); // Reject the promise if there is an error
        }

        console.log("Image saved to", filePath);

        // Store the path in the savedImages array
        savedImages.push({
          name: file.name,
          path: filePathDB,
        });

        // If all images are processed, resolve the promise
        if (savedImages.length === folderFiles.length) {
          resolve(savedImages); // Return the saved image paths
        }
      });
    });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
