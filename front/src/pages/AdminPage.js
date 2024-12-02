import React, { useState } from "react";
import AdminPasswordPrompt from "../components/passwordPrompt";
import Modal from "../components/modal";
import AddClassForm from "../components/post/addClassForm";
import AddStudentForm from "../components/post/addStudentForm";
import AddSessionForm from "../components/post/addSessionForm";
import AddScheduleForm from "../components/post/addScheduleForm";
import AddStudentClassForm from "../components/post/addStudentClassForm";

function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [hasAccess, setHasAccess] = useState(false); // Track if user has entered the correct password

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleAccessGranted = () => {
    setHasAccess(true); // User entered the correct password
  };

  if (!hasAccess) {
    return <AdminPasswordPrompt onAccessGranted={handleAccessGranted} />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => openModal(<AddClassForm />)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tambah Kelas
        </button>
        <button
          onClick={() => openModal(<AddStudentForm />)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Tambah Mahasiswa
        </button>
        <button
          onClick={() => openModal(<AddSessionForm />)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Tambah Sesi Kelas
        </button>
        <button
          onClick={() => openModal(<AddScheduleForm />)}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Tambah Jadwal Kelas
        </button>
        <button
          onClick={() => openModal(<AddStudentClassForm />)}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Tambah Mahasiswa ke Kelas
        </button>
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6">{modalContent}</div>
        </Modal>
      )}
    </div>
  );
}

export default AdminPage;
