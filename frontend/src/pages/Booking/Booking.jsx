import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import bookingApi from "../../api/bookingApi";
import { useAuth } from "../../context/AuthContext";

function Booking() {
  const { photographer_id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookingType: "",
    date: "",
    time: "",
  });
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);

  const bookingTypes = [
    { id: "portrait", name: "Portrait Session", duration: "1 hour" },
    { id: "family", name: "Family Session", duration: "2 hours" },
    { id: "event", name: "Event Coverage", duration: "4 hours" },
    { id: "wedding", name: "Wedding Package", duration: "8 hours" },
  ];

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("booking-date").min = today;

    generateTimeSlots();
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(time);
      }
    }
    setTimeSlots(slots);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "date") {
      validateDate(value);
      if (formData.time) {
        validateDateTime(value, formData.time);
      }
    } else if (name === "time") {
      validateDateTime(formData.date, value);
    }
  };

  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setDateError("Please select a future date");
    } else {
      setDateError("");
    }
  };

  const validateDateTime = (date, time) => {
    if (!date) {
      setTimeError("Please select a date first");
      return;
    }

    const [hours, minutes] = time.split(":");
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(
      Number.parseInt(hours),
      Number.parseInt(minutes),
      0,
      0
    );

    const now = new Date();

    if (selectedDateTime <= now) {
      setTimeError("Please select a future date and time");
    } else {
      setTimeError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dateError || timeError) {
      return;
    }
    try {
      const booking = await bookingApi.createBooking({
        ...formData,
        photographer_id: Number(photographer_id),
        user_id: Number(user.id),
      });

      if (booking) {
        navigate("/discover");
      }
    } catch (error) {
      alert("Failed to create booking: " + error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Book Your Session
          </h2>
          <p className="text-gray-600 mb-8">Photographer #{photographer_id}</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="booking-type"
                className="block text-sm font-medium text-gray-700"
              >
                Session Type
              </label>
              <select
                id="booking-type"
                name="bookingType"
                value={formData.bookingType}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              >
                <option value="">Select a session type</option>
                {bookingTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.duration})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="booking-date"
                className="block text-sm font-medium text-gray-700"
              >
                Select Date
              </label>
              <input
                id="booking-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  dateError ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {dateError && (
                <p className="mt-1 text-sm text-red-600">{dateError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="booking-time"
                className="block text-sm font-medium text-gray-700"
              >
                Select Time
              </label>
              <select
                id="booking-time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  timeError ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="">Select a time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {timeError && (
                <p className="mt-1 text-sm text-red-600">{timeError}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!!dateError || !!timeError}
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking;
