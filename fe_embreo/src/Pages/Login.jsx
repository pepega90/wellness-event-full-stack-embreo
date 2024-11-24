import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const HandleSubmit = async (e) => {
    e.preventDefault();

    try {
      const {
        data: { message, token },
      } = await axios.post("login", {
        username,
        password,
      });
      localStorage.setItem("token", token);
      if (token) {
        switch (username) {
          case "hr":
            navigate("/");
            break;
          case "vendor":
            navigate("/events");
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative bg-gray-900 text-white w-full max-w-md shadow-[8px_8px_0px_#ff9e00] border-2 border-black">
        {/* Decorative Shapes */}
        <div className="absolute -top-4 -left-4 h-12 w-12 bg-yellow-500 border-2 border-black"></div>
        <div className="absolute -bottom-4 -right-4 h-16 w-16 bg-blue-500 border-2 border-black"></div>

        {/* Login Form */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center border-b-2 border-yellow-500 pb-4">
            Wellness Event
            <br />
            <br />
            Login
          </h1>
          <form className="mt-6 space-y-6" onSubmit={HandleSubmit}>
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold uppercase tracking-wide"
              >
                Username
              </label>
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                name="username"
                className="w-full mt-2 px-4 py-2 border-2 border-black bg-gray-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold uppercase tracking-wide"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                className="w-full mt-2 px-4 py-2 border-2 border-black bg-gray-100 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-bold py-2 px-4 rounded-md border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] transition-transform transform active:translate-y-1"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-sm text-center text-white-400">
            Create by Aji Mustofa @pepega90
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
