"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Cards from "../components/ui/cards/cards";
import Navbar from "../components/ui/navbar/Navbar";
import Footer from "../components/ui/footer/footer";
import { LoginPage } from "../components/ui/login/login";

import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = Cookies.get('loggedIn');
    setIsLoggedIn(!!loggedIn);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    Cookies.remove('loggedIn');
    toast.error('Logged out successfully!', {
      position: "top-right",
      autoClose: 1000,
    });
    setTimeout(() => {
      setIsLoggedIn(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900">
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <Navbar onSearch={setSearchQuery} onLogout={handleLogout} />
          <Cards searchQuery={searchQuery} />
          <Footer />
        </>
      )}
    </main>
  );
}

