import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import ViewDataPage from "./pages/ViewPage";
import StudentsPage from "./pages/StudentPage";
import AttendancePage from "./pages/AttendancePage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/view" element={<ViewDataPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
      </Routes>
    </Router>
  );
};

export default App;
