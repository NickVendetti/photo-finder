import { useParams } from "react-router-dom";
import { useState } from "react";

function Booking() {
  let { photographer_id } = useParams(); // Get photographer ID from URL

  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Details:", formData);
    alert("Booking confirmed!");
    // Here, you would send the form data to your backend
  };
  
  
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Booking for Photo #{photographer_id}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium">Your Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium">Select Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Time Input */}
        <div>
          <label className="block text-sm font-medium">Select Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default Booking;