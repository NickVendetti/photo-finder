-- Create Users table (stores both photographers and customers)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  user_type VARCHAR(20) CHECK (user_type IN ('photographer', 'customer')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Create Photographers table (linked to users)
CREATE TABLE photographers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  portfolio_url TEXT,
  location VARCHAR(255),
  profile_picture TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Photos table (stores uploaded images by photographers)
CREATE TABLE photos(
  id SERIAL PRIMARY KEY,
  photographer_id INTEGER REFERENCES photographers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  category VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Create Reviews table (customers review photographers)
CREATE TABLE reviews(
  id SERIAL PRIMARY KEY,
  photographer_id INTEGER REFERENCES photographers(id) ON DELETE CASCADE,
  customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  review_text TEXT,
  recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bookings table (tracks customers hiring photographers)
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  photographer_id INTEGER REFERENCES photographers(id) ON DELETE CASCADE,
  customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_date TIMESTAMP NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'completed', 'canceled')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);