import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie'; // Import js-cookie
import ReactPlayer from 'react-player';

// Define the prop types
interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showFailVideo, setShowFailVideo] = useState(false);
  const [failVideoUrl, setFailVideoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsername = process.env.NEXT_PUBLIC_USERNAME;
    const validPassword = process.env.NEXT_PUBLIC_PASSWORD;

    // Check for empty inputs
    if (!username || !password) {
      toast.error("Please enter your username and password");
      return; // Exit the function if inputs are empty
    }

    if (username === validUsername && password === validPassword) {
      toast.success("Login successful!");
      // Set cookie for user session as a string
      Cookies.set('loggedIn', JSON.stringify(true), { expires: 2 }); // Expires in 2 days
      // Add a delay before calling onLoginSuccess
      setTimeout(() => {
        onLoginSuccess();
      }, 1500); 
    } else {
      toast.error("Invalid username or password");

      // Array of video URLs
      const videoUrls = [
        "https://funsoft.vercel.app/fail.mp4",
        "https://funsoft.vercel.app/fail1.mp4",
        "https://funsoft.vercel.app/fail2.mp4",
        "https://funsoft.vercel.app/fail3.mp4"
      ];

      // Select a random video URL
      const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];

      setFailVideoUrl(randomVideoUrl);
      setShowFailVideo(true); // Show video on failure

      setTimeout(() => {
        setShowFailVideo(false); // Hide video after 5 seconds
      }, 5500); 
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center min-h-screen">
      <Card className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6">
        <CardHeader>
          <CardTitle className="text-white">Login</CardTitle>
          <CardDescription className="text-gray-400">
            Please enter your credentials to continue.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 focus:ring-blue-500"
              />
            </div>
          </CardContent>
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">Login</Button>
          </div>
        </form>
      </Card>
      {showFailVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 fade-in-out mobvid">
          <ReactPlayer url={failVideoUrl} playing width="50%" height="60%" />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
