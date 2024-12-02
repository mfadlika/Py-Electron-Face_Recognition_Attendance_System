// src/pages/ViewPage.js
import React, { useState } from "react";
import Modal from "../components/modal"; // Adjust the import path if needed
import ViewClassForm from "../components/get/viewClassForm";
import ViewStudentForm from "../components/get/viewStudentForm";
import ViewSessionForm from "../components/get/viewSessionForm";

function ViewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Function to open modal with specific content
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">View Data</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <button
          onClick={() => openModal(<ViewClassForm />)} // Open ViewClasses modal
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Classes
        </button>
        <button
          onClick={() => openModal(<ViewStudentForm />)} // Open ViewStudents modal
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View Students
        </button>
        <button
          onClick={() => openModal(<ViewSessionForm />)} // Open ViewStudents modal
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View Session
        </button>
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>{modalContent}</Modal>
      )}
    </div>
  );
}

export default ViewPage;
