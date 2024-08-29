"use client";
import React, { useEffect, useState } from 'react';
import Navbar from "../../components/ui/navbar/Navbar";
import Footer from "../../components/ui/footer/footer";
import Cookies from 'js-cookie';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user is logged in based on cookies
    setIsLoggedIn(!!Cookies.get('loggedIn'));
  }, []);

  // Define the onSearch and onLogout functions
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  const handleLogout = () => {
    console.log('Logging out');
    // Implement logout functionality
    Cookies.remove('loggedIn');
    setIsLoggedIn(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
      {isLoggedIn ? (
        <Navbar onSearch={handleSearch} onLogout={handleLogout} />
      ) : null} {/* Conditionally render Navbar */}
      <main className="flex-grow p-4">{children}</main>
      {isLoggedIn ? <Footer /> : null} {/* Conditionally render Footer */}
    </div>
  );
};

export default Layout;
