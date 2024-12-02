import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-6xl mx-auto flex justify-center space-x-10">
        {" "}
        {/* Increased space-x-10 */}
        <Link
          to="/"
          className="text-white text-lg font-semibold hover:text-blue-400"
        >
          Home
        </Link>
        <Link
          to="/admin"
          className="text-white text-lg font-semibold hover:text-blue-400"
        >
          Admin
        </Link>
        <Link
          to="/view"
          className="text-white text-lg font-semibold hover:text-blue-400"
        >
          Data
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
