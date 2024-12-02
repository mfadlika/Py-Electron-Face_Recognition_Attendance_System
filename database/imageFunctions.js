// Function to update the students table with image file paths
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/attendance.db");
const path = require("path");
const fs = require("fs");

function updateStudentImages() {
  const imageDir = path.join(__dirname, "/images"); // Path to the images folder

  // Read all files in the images folder
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      console.error("Error reading image directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(imageDir, file);

      // Skip directories, process only files
      if (fs.statSync(filePath).isFile()) {
        // Assuming file name format is "student_id - name.jpg"
        const fileName = path.basename(file, path.extname(file)); // Get the file name without extension
        const [student_id, ...nameParts] = fileName.split(" - ");
        const name = nameParts.join(" "); // Join name parts in case the name has spaces

        // Generate the file path you want to store in the database
        const imagePath = `database/images/${file}`;

        // Update the student record with the image path
        const query = `INSERT OR IGNORE INTO students (image, id, name) VALUES (?, ?, ?)`;

        db.run(query, [imagePath, student_id, name], function (err) {
          if (err) {
            // console.error("Error updating student record:", err);
          } else {
            // console.log(`Updated student ${name} with image path ${imagePath}`);
          }
        });
      }
    });
  });
}

module.exports = {
  updateStudentImages,
};
