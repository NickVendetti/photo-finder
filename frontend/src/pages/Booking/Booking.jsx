import { useState } from "react";
import "./Booking.css";
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

  const bookingTypes = [
    { id: "portrait", name: "Portrait Session", duration: "1 hour" },
    { id: "family", name: "Family Session", duration: "2 hours" },
    { id: "event", name: "Event Coverage", duration: "4 hours" },
    { id: "wedding", name: "Wedding Package", duration: "8 hours" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="booking-container">
      <div className="booking-card">
        <div className="booking-header">
          <h1 className="booking-title">Book Your Session</h1>
          <p className="booking-subtitle">Photographer #{photographer_id}</p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="booking-type" className="form-label">
              Session Type
            </label>
            <select
              id="booking-type"
              name="bookingType"
              value={formData.bookingType}
              onChange={handleChange}
              className="form-select"
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

          <div className="form-group">
            <label htmlFor="booking-date" className="form-label">
              Select Date
            </label>
            <input
              id="booking-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="booking-time" className="form-label">
              Select Time
            </label>
            <input
              id="booking-time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
