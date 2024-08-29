"use client";
import React from 'react';
import Link from 'next/link';

// Define the prop types
interface NavbarProps {
  onSearch: (searchTerm: string) => void; // Function that takes a string and returns void
  onLogout: () => void; // Function that returns void
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onLogout }) => { // Add type annotation here
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value); // Call onSearch with the input value
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* SVG Logo on the left */}
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <img src="/acmnav.svg" alt="ACM Logo" className="h-30 w-70" />
          <Link href="/" className="text-lg font-semibold">
            Recruitments Dashboard
          </Link>
        </div>

        {/* Search bar in the center */}
        <div className="flex-1 max-w-lg mx-auto order-1 mb-5 md:mb-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange}
              className="w-full bg-gray-800 text-white rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 text-gray-400 w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1012 19.5 7.5 7.5 0 0016.65 16.65z"
              />
            </svg>
          </div>
        </div>

        {/* Links on the right */}
        <div className="flex space-x-4 order-2">
          <Link
            href="/"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300 transform hover:scale-105"
          >
            Home
          </Link>
          <Link
            href="/graphs"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105"
          >
            Graphs
          </Link>
          <button
            onClick={onLogout} // Call onLogout when clicked
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
