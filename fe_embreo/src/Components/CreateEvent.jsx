import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CreateEventModal({ onClose, onCreate }) {
  const [newEvent, setNewEvent] = useState({
    event_name: "",
    company_name: "",
    proposed_dates: [],
    proposed_location: "",
  });
  const [selectedDate, setSelectedDate] = useState(null); // For the date picker

  const handleAddDate = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      if (!newEvent.proposed_dates.includes(formattedDate)) {
        setNewEvent({
          ...newEvent,
          proposed_dates: [...newEvent.proposed_dates, formattedDate],
        });
      }
      setSelectedDate(null); // Clear the selected date
    }
  };

  const handleRemoveDate = (date) => {
    setNewEvent({
      ...newEvent,
      proposed_dates: newEvent.proposed_dates.filter((d) => d !== date),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newEvent); // Pass the new event data to the parent
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg border-4 border-black">
        <h2 className="text-xl font-bold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit}>
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
              Vendor Name
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
                setNewEvent({ ...newEvent, proposed_location: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
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
  );
}

export default CreateEventModal;
