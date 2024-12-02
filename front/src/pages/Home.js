import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold text-blue-600">
        Welcome to the Home Page
      </h1>
      <div className="max-w-6xl mx-auto flex justify-center space-x-10">
        <Link
          to="/attendance"
          className="text-white text-lg font-semibold hover:text-blue-400"
        >
          Presensi
        </Link>
      </div>
    </div>
  );
};

export default Home;
