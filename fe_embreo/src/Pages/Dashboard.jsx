import React, { useEffect, useState } from "react";
import Wrapper from "../Components/Wrapper";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [countPending, setCountPending] = useState(0);
  const [countRejected, setCountRejected] = useState(0);
  const [countApproved, setCountApproved] = useState(0);

  const fetchEvents = async (token) => {
    try {
      const listStatus = ["Pending", "Approved", "Rejected"];
      const request = listStatus.map((status) =>
        axios.get(`events?status=${status}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const response = await Promise.all(request);

      const data = {
        pending: response[0].data,
        approved: response[1].data,
        rejected: response[2].data,
      };

      setCountPending(data.pending.length);
      setCountRejected(data.rejected.length);
      setCountApproved(data.approved.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchEvents(token);
    if (!token) navigate("/login");
  }, []);

  return (
    <Wrapper>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0_#ff9e00] p-4">
          <h3 className="text-lg font-bold uppercase">Event Pending</h3>
          <p className="text-3xl font-bold mt-4">{countPending}</p>
        </div>
        <div className="bg-white border-4 border-black shadow-[8px_8px_0_#ff5757] p-4">
          <h3 className="text-lg font-bold uppercase">Event Reject</h3>
          <p className="text-3xl font-bold mt-4">{countRejected}</p>
        </div>
        <div className="bg-white border-4 border-black shadow-[8px_8px_0_#57ff5a] p-4">
          <h3 className="text-lg font-bold uppercase">Event Approve</h3>
          <p className="text-3xl font-bold mt-4">{countApproved}</p>
        </div>
      </div>
    </Wrapper>
  );
};

export default Dashboard;
