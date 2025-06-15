import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold text-blue-600">
        Welcome to the Home Page
      </h1>
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mt-8">
        <Link
          to="/attendance"
          className="text-black-200 text-lg font-semibold hover:text-blue-400"
        >
          Presensi
        </Link>
      </button>
    </div>
  );
};

export default Home;
