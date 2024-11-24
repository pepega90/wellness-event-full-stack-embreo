import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Wrapper = ({ children }) => {
  const navigate = useNavigate();
  const [currentLoginUser, setCurrentLoginUser] = useState({});

  const HandleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          let { data } = await axios.get("me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCurrentLoginUser(data);
        }
      } catch (error) {}
    })();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col border-r-4 border-black shadow-[8px_0_0_#ff9e00]">
        <div className="p-6">
          <h1 className="text-lg font-bold tracking-wide uppercase">
            Wellness Event
          </h1>
        </div>
        <nav className="flex flex-col space-y-4 px-4">
          {currentLoginUser.role == "HR" && (
            <NavLink
              to={"/"}
              className="py-2 px-4 bg-yellow-500 text-black font-bold rounded-md border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] transition-transform transform active:translate-y-1"
            >
              Home
            </NavLink>
          )}
          <NavLink
            to={"/events"}
            className="py-2 px-4 bg-blue-500 text-black font-bold rounded-md border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] transition-transform transform active:translate-y-1"
          >
            Events
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b-4 border-black shadow-[0_4px_0_#000] flex items-center justify-between px-6">
          <h2 className="text-xl font-bold text-gray-900 uppercase">
            Welcome, {currentLoginUser.username}
          </h2>
          <button
            onClick={HandleLogout}
            className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-md border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] transition-transform transform active:translate-y-1"
          >
            Logout
          </button>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Wrapper;
