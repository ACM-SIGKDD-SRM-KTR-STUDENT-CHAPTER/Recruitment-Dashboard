"use client";
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 rounded-t-2xl shadow-lg">
      <div className="container mx-auto text-center">
        <p className="text-lg font-semibold">ACM SRM SIGKDD Recruitments</p>
        <p className="text-sm text-gray-400 mt-2">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
        <div className="mt-4 flex flex-wrap justify-center">
          <a href="https://srmsigkdd.vercel.app/" className="text-blue-400 hover:underline text-xs mx-1 sm:text-sm">Official Website</a>
          <a href="https://www.linkedin.com/in/adityave/" className="text-blue-400 hover:underline text-xs mx-1 sm:text-sm">Developer</a>
          <a href="https://www.srmist.edu.in/department/department-of-data-science-and-business-systems/srm-sig-kdd-students-chapter/" className="text-blue-400 hover:underline text-xs mx-1 sm:text-sm">SRM Website</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
