import React, { useState } from "react";

function AddLecturerForm() {
  const [name, setName] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [image, setImage] = useState(null);

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

  // Upload single student image
  const uploadSingleImage = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const imagePath = await window.electron.saveImage(
      image,
      `${lecturerId} - ${name}`
    );

    return imagePath;
  };

  // Handle form submission for manually adding student
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !lecturerId) {
      alert("All fields are required!");
      return;
    }

    let imagePath = null;

    // Upload single image if selected
    if (image) {
      imagePath = await uploadSingleImage();
    }

    // Now save the student to the database, using the image path
    const personData = {
      type: "lecturer",
      name: name,
      id: lecturerId,
      image: imagePath, // Use the file path here
    };

    // Call the addPerson function to insert into the database
    try {
      await window.electron.addPerson(personData);
      alert("Lecturer added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add lecturer. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      {/* Manually Add Student Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Add Lecturer</h3>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <input
            type="text"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Lecturer ID Input */}
          <input
            type="text"
            placeholder="Lecturer ID"
            value={lecturerId}
            onChange={(e) => setLecturerId(e.target.value)}
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
            Add Lecturer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLecturerForm;
