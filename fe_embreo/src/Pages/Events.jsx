import React, { useEffect, useState } from "react";
import Wrapper from "../Components/Wrapper";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [listVendor, setListVendor] = useState([]);
  const [currentLoginUser, setCurrentLoginUser] = useState({});
  const [newEvent, setNewEvent] = useState({
    event_name: "",
    company_name: "",
    proposed_dates: [],
    proposed_location: "",
    vendor_id: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedApprovalDate, setSelectedApprovalDate] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showApproveOrReject, setShowApproveOrReject] = useState("");

  // useeffect for fetch user
  useEffect(() => {
    const fetchUserLogin = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const { data } = await axios.get("me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentLoginUser(data);
      }
    };
    fetchUserLogin();
  }, []);

  // useeffect for fetch events
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
        const { data } = await axios.get("events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const vendorData = await axios.get("vendors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setListVendor(vendorData.data.data || []);
        setEvents(data || []);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleApprove = async (eventId, approveDate) => {
    if (!approveDate) {
      alert("Please select a date to approve");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `event/${eventId}/approve`,
        { confirmed_date: approveDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Event approved successfully!");
      closeModal();
      const { data } = await axios.get("events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to approve the event.");
    }
  };

  const handleReject = async (eventId, reasonReject) => {
    if (!reasonReject) {
      alert("Please insert reason for rejection!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `event/${eventId}/reject`,
        { remarks: reasonReject },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Event rejected successfully!");
      closeModal();
      const { data } = await axios.get("events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to approve the event.");
    }
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setShowApproveOrReject("");
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewEvent({
      event_name: "",
      company_name: "",
      proposed_dates: [],
      proposed_location: "",
    });
    setSelectedDate(null);
  };

  const handleAddDate = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      if (!newEvent.proposed_dates.includes(formattedDate)) {
        setNewEvent({
          ...newEvent,
          proposed_dates: [...newEvent.proposed_dates, formattedDate],
        });
      }
      setSelectedDate(null);
    }
  };

  const handleRemoveDate = (date) => {
    setNewEvent({
      ...newEvent,
      proposed_dates: newEvent.proposed_dates.filter((d) => d !== date),
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("events", newEvent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      closeCreateModal();
      alert("Event created successfully!");

      const { data } = await axios.get("events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <Wrapper>
      <div className="mt-8 bg-white border-4 border-black shadow-[8px_8px_0_#000] p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold uppercase">Latest Events</h3>
          {currentLoginUser.role == "HR" && (
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-green-500 text-white font-bold rounded-md border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-transform transform active:translate-y-1"
            >
              Create Event
            </button>
          )}
        </div>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="border-b-4 border-black px-4 py-2">Event Name</th>
              <th className="border-b-4 border-black px-4 py-2">Vendor</th>
              <th className="border-b-4 border-black px-4 py-2">Status</th>
              <th className="border-b-4 border-black px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event, index) => (
                <tr key={index}>
                  <td className="border-b-2 border-black px-4 py-2">
                    {event.event_name}
                  </td>
                  <td className="border-b-2 border-black px-4 py-2">
                    {event.company_name}
                  </td>
                  <td
                    className={`border-b-2 border-black px-4 py-2 font-bold ${
                      event.status === "Pending"
                        ? "text-yellow-600"
                        : event.status === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {event.status}
                  </td>
                  <td className="border-b-2 border-black px-4 py-2">
                    <button
                      onClick={() => handleViewEvent(event)}
                      className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-transform transform active:translate-y-1"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border-b-2 border-black px-4 py-2 text-center"
                  colSpan="4"
                >
                  No events available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Event Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg border-4 border-black">
            <h2 className="text-xl font-bold mb-4">
              {selectedEvent.event_name}
            </h2>
            <p>
              <strong>Vendor:</strong> {selectedEvent.company_name}
            </p>
            <p>
              <strong>Status:</strong> {selectedEvent.status}
            </p>
            <p>
              <strong>Proposed Dates:</strong>{" "}
              {selectedEvent.proposed_dates.join(", ")}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.proposed_location}
            </p>
            <p>
              <strong>Date Created:</strong>{" "}
              {new Date(selectedEvent.date_created).toLocaleDateString()}
            </p>

            {/* Conditionally Render Approve/Reject Buttons for Vendors */}
            {currentLoginUser.role.toLowerCase() === "vendor" &&
              showApproveOrReject == "" && (
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setShowApproveOrReject("approve")}
                    className="px-4 py-2 bg-green-500 text-white font-bold rounded-md border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-transform transform active:translate-y-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setShowApproveOrReject("reject")}
                    className="px-4 py-2 bg-red-500 text-white font-bold rounded-md border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-transform transform active:translate-y-1"
                  >
                    Reject
                  </button>
                </div>
              )}

            {/* Conditionally Render Approve/Reject Buttons for Vendors */}
            {showApproveOrReject == "approve" && (
              <div className="mt-6">
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Select a Date to Approve:
                  </label>
                  <select
                    value={selectedApprovalDate}
                    onChange={(e) => setSelectedApprovalDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="" disabled>
                      --- Select a Date ---
                    </option>
                    {selectedEvent.proposed_dates.map((date, index) => (
                      <option key={index} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() =>
                    handleApprove(selectedEvent.id, selectedApprovalDate)
                  }
                  className="px-4 py-2 bg-green-500 text-white font-bold rounded-md border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-transform transform active:translate-y-1 mb-4"
                  disabled={!selectedApprovalDate}
                >
                  Approve
                </button>
              </div>
            )}

            {showApproveOrReject == "reject" && (
              <div className="mt-6">
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Reason for Rejection:
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Enter the reason for rejection..."
                  />
                </div>
                <button
                  onClick={() =>
                    handleReject(selectedEvent.id, rejectionReason)
                  }
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-md border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-transform transform active:translate-y-1"
                  disabled={!rejectionReason}
                >
                  Reject
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded-md border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-transform transform active:translate-y-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg border-4 border-black">
            <h2 className="text-xl font-bold mb-4">Create New Event</h2>
            <form onSubmit={handleCreateEvent}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={newEvent.company_name}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, company_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={newEvent.event_name}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, event_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Proposed Dates
                </label>
                <div className="flex items-center space-x-4 mb-2">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="px-4 py-2 border rounded-md"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a date"
                  />
                  <button
                    type="button"
                    onClick={handleAddDate}
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-transform transform active:translate-y-1"
                  >
                    Add Date
                  </button>
                </div>
                <div className="flex flex-wrap space-x-2">
                  {newEvent.proposed_dates.map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-pink-500 text-white px-3 py-1 rounded-full space-x-2"
                    >
                      <span>{date}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDate(date)}
                        className="text-white font-bold"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newEvent.proposed_location}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      proposed_location: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Vendor Name
                </label>
                <select
                  value={newEvent.vendor_id}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, vendor_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option value="" disabled>
                    --- Select Vendor ---
                  </option>
                  {listVendor.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-md border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-transform transform active:translate-y-1 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white font-bold rounded-md border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-transform transform active:translate-y-1"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Wrapper>
  );
}

export default Events;
