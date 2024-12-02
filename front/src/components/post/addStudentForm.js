import React, { useState } from "react";

function AddStudentForm() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [image, setImage] = useState(null);
  const [folderFiles, setFolderFiles] = useState([]);

  // Handle individual image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Save the base64 data URL
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle folder selection
  const handleFolderChange = (event) => {
    const files = event.target.files;

    // Filter the files to only include image files (jpg, jpeg, png)
    const imageFiles = Array.from(files).filter((file) => {
      return file.name.match(/\.(jpg|jpeg|png)$/i);
    });

    // Prepare the file paths with base64 data for valid image files
    const folderFiles = imageFiles.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({ name: file.name, data: reader.result });
        };
        reader.readAsDataURL(file); // Convert to base64 data
      });
    });

    // Wait for all files to be processed and update state
    Promise.all(folderFiles).then((filesData) => {
      setFolderFiles(filesData); // Set the filtered files with base64 data
    });
  };

  // Upload single student image
  const uploadSingleImage = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const imagePath = await window.electron.saveStudentImage(
      image,
      `${studentId} - ${name}`
    );

    return imagePath;
  };

  // Upload folder of images
  const uploadFolderImages = async () => {
    if (folderFiles.length === 0) {
      alert("Please select a folder first!");
      return;
    }

    try {
      // Send the file objects to the backend (main process)
      const result = await window.electron.uploadStudentImages(folderFiles);

      alert("Folder uploaded successfully!");
    } catch (error) {
      console.error("Error uploading folder:", error);
      alert("An error occurred while uploading the folder.");
    }
  };

  // To trigger the file selection dialog

  // Sync all student images (update)
  const sync = async () => {
    // Call the updateStudentImages function to sync images
    await window.electron.updateStudentImages();
    alert("Already synced");
  };

  // Handle form submission for manually adding student
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !studentId) {
      alert("All fields are required!");
      return;
    }

    let imagePath = null;

    // Upload single image if selected
    if (image) {
      imagePath = await uploadSingleImage();
    }

    // Now save the student to the database, using the image path
    const studentData = {
      name,
      student_id: studentId,
      image: imagePath, // Use the file path here
    };

    // Call the addStudent function to insert into the database
    try {
      await window.electron.addStudent(studentData);
      alert("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-6">Manage Students</h2>

      {/* Manually Add Student Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Add Student Manually</h3>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <input
            type="text"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Student ID Input */}
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Image File Input */}
          <input
            type="file"
            onChange={handleImageChange}
            className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded text-white font-semibold bg-blue-500 hover:bg-blue-700"
          >
            Add Student
          </button>
        </form>
      </div>

      {/* Sync Students Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Sync Students</h3>
        <button
          onClick={sync}
          className="w-full py-3 rounded text-white font-semibold bg-yellow-500 hover:bg-blue-700"
        >
          Sync Students
        </button>
      </div>

      {/* Upload Folder of Images Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Upload Folder of Images</h3>
        {/* Folder File Input */}
        <input
          type="file"
          webkitdirectory="true"
          directory="true"
          onChange={handleFolderChange}
          className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none"
        />

        <button
          onClick={uploadFolderImages}
          className="w-full py-3 rounded text-white font-semibold bg-green-500 hover:bg-blue-700"
        >
          Upload Folder of Images
        </button>
      </div>
    </div>
  );
}

export default AddStudentForm;
