# Data-TestID Implementation Guide

This document outlines the required `data-testid` attributes that need to be added to frontend components for E2E tests to work properly.

## Why data-testid?

- **Reliability**: Unlike CSS classes or IDs, data-testid attributes are specifically for testing
- **Stability**: They don't change with styling updates
- **Clarity**: They make test selectors obvious and intentional
- **Best Practice**: Recommended by testing frameworks and React Testing Library

## Required Data-TestID Attributes by Component

### Authentication Components

#### Login Page (`/login`)
```jsx
// Login form container
<form data-testid="login-form">
  <input data-testid="email-input" type="email" />
  <input data-testid="password-input" type="password" />
  <button data-testid="login-button">Login</button>
  <a data-testid="register-link" href="/register">Register</a>
  <div data-testid="error-message">Error message here</div>
</form>
```

#### Register Page (`/register`)
```jsx
// Registration form container
<form data-testid="register-form">
  <input data-testid="username-input" type="text" />
  <input data-testid="email-input" type="email" />
  <input data-testid="password-input" type="password" />
  <select data-testid="user-type-select">
    <option value="USER">User</option>
    <option value="PHOTOGRAPHER">Photographer</option>
  </select>
  <button data-testid="register-button">Register</button>
  <a data-testid="login-link" href="/login">Login</a>
  <div data-testid="error-message">Error message</div>
  <div data-testid="success-message">Success message</div>
</form>
```

### Navigation Components

#### Navbar
```jsx
<nav data-testid="navbar">
  <button data-testid="nav-login-button">Login</button>
  <button data-testid="nav-register-button">Register</button>
  <button data-testid="user-menu-button">User Menu</button>
  <button data-testid="logout-button">Logout</button>
</nav>
```

### Home Page Components

#### Home Page (`/`)
```jsx
<div data-testid="hero-section">
  <h1 data-testid="hero-title">Title</h1>
  <p data-testid="hero-description">Description</p>
  <button data-testid="discover-button">Discover Photographers</button>
</div>
<section data-testid="features-section">
  Features content
</section>
```

### Discovery Page Components

#### Discovery Page (`/discover`)
```jsx
<div data-testid="search-section">
  <input data-testid="search-input" placeholder="Search photographers..." />
  <button data-testid="search-button">Search</button>
</div>

<div data-testid="photographer-grid">
  {photographers.map(photographer => (
    <div key={photographer.id} data-testid="photographer-card">
      <h3 data-testid="photographer-name">{photographer.name}</h3>
      <img data-testid="photographer-photo" src={photographer.image} />
      <button data-testid="book-button">Book Now</button>
      <button data-testid="view-portfolio-button">View Portfolio</button>
    </div>
  ))}
</div>

<div data-testid="no-results-message">No photographers found</div>
<div data-testid="loading-spinner">Loading...</div>
```

### Booking Components

#### Booking Page (`/booking/:id`)
```jsx
<div data-testid="photographer-info">
  <h2 data-testid="photographer-name">{photographer.name}</h2>
  <div data-testid="photographer-portfolio">
    Portfolio images
  </div>
</div>

<form data-testid="booking-form">
  <select data-testid="booking-type-select">
    <option value="portrait">Portrait</option>
    <option value="wedding">Wedding</option>
    <option value="event">Event</option>
    <option value="landscape">Landscape</option>
  </select>
  <input data-testid="date-input" type="date" />
  <input data-testid="time-input" type="time" />
  <div data-testid="booking-preview">Booking preview</div>
  <button data-testid="submit-booking-button">Book Session</button>
  <button data-testid="cancel-button">Cancel</button>
  <div data-testid="confirmation-message">Booking confirmed!</div>
  <div data-testid="error-message">Booking error</div>
</form>
```

### Photographer Dashboard Components

#### Photographer Dashboard (`/profile-dashboard`)
```jsx
<div data-testid="photographer-dashboard">

  {/* Profile Section */}
  <section data-testid="profile-section">
    <button data-testid="edit-profile-button">Edit Profile</button>
    <form data-testid="profile-edit-form">
      <button data-testid="save-profile-button">Save</button>
    </form>
  </section>

  {/* Portfolio Section */}
  <section data-testid="portfolio-section">
    <button data-testid="upload-photo-button">Upload Photo</button>

    {/* Upload Form */}
    <form data-testid="photo-upload-form">
      <input data-testid="file-input" type="file" />
      <input data-testid="photo-title-input" placeholder="Photo title" />
      <textarea data-testid="photo-description-input" placeholder="Description" />
      <button data-testid="upload-button">Upload</button>
    </form>

    {/* Photo Grid */}
    <div data-testid="photo-grid">
      {photos.map(photo => (
        <div key={photo.id} data-testid="photo-card">
          <img data-testid="photo-image" src={photo.src} />
          <h4 data-testid="photo-title">{photo.title}</h4>
          <button data-testid="edit-photo-button">Edit</button>
          <button data-testid="delete-photo-button">Delete</button>
        </div>
      ))}
    </div>

    {/* Photo Edit Form */}
    <form data-testid="photo-edit-form">
      <input data-testid="photo-title-input" />
      <textarea data-testid="photo-description-input" />
      <button data-testid="save-photo-button">Save</button>
    </form>
  </section>

  {/* Bookings Section */}
  <section data-testid="bookings-section">
    <div data-testid="booking-list">
      {bookings.map(booking => (
        <div key={booking.id} data-testid="booking-card">
          <span data-testid="booking-date">{booking.date}</span>
          <span data-testid="booking-time">{booking.time}</span>
          <span data-testid="booking-type">{booking.type}</span>
          <span data-testid="booking-client">{booking.client}</span>
          <span data-testid="booking-status">{booking.status}</span>
          <button data-testid="accept-booking-button">Accept</button>
          <button data-testid="reject-booking-button">Reject</button>
          <button data-testid="complete-booking-button">Complete</button>
        </div>
      ))}
    </div>
  </section>

  <div data-testid="success-message">Success!</div>
  <div data-testid="error-message">Error occurred</div>
</div>
```

#### Booking Manager Page (`/manage-bookings`)
```jsx
<div data-testid="booking-manager">

  {/* Filters */}
  <div data-testid="booking-filters">
    <select data-testid="booking-filter-select">
      <option value="all">All Bookings</option>
      <option value="pending">Pending</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
    <input data-testid="booking-search-input" placeholder="Search bookings..." />
  </div>

  {/* Booking List */}
  <div data-testid="booking-list">
    {bookings.map(booking => (
      <div key={booking.id} data-testid="booking-card">
        <span data-testid="booking-date">{booking.date}</span>
        <span data-testid="booking-time">{booking.time}</span>
        <span data-testid="booking-type">{booking.type}</span>
        <span data-testid="booking-client">{booking.client}</span>
        <span data-testid="booking-status">{booking.status}</span>
        <button data-testid="accept-booking-button">Accept</button>
        <button data-testid="reject-booking-button">Reject</button>
        <button data-testid="complete-booking-button">Complete</button>
      </div>
    ))}
  </div>

  <div data-testid="no-bookings-message">No bookings found</div>
  <div data-testid="success-message">Action completed successfully</div>
  <div data-testid="error-message">An error occurred</div>
</div>
```

### Gallery and Photo Components

#### Photo Gallery Component
```jsx
<div data-testid="photo-gallery">
  <div data-testid="gallery-controls">
    <button data-testid="gallery-prev">Previous</button>
    <button data-testid="gallery-next">Next</button>
  </div>
  <div data-testid="gallery-images">
    {images.map(image => (
      <img key={image.id} data-testid="gallery-image" src={image.src} />
    ))}
  </div>
</div>

<div data-testid="photo-modal">
  <img data-testid="modal-image" />
  <button data-testid="modal-close">Close</button>
</div>
```

### Utility Components

#### Loading States
```jsx
<div data-testid="loading-spinner">Loading...</div>
<div data-testid="photo-skeleton">Photo loading skeleton</div>
```

#### Messages
```jsx
<div data-testid="success-message">Success message</div>
<div data-testid="error-message">Error message</div>
<div data-testid="info-message">Info message</div>
<div data-testid="warning-message">Warning message</div>
```

#### Confirmation Dialogs
```jsx
<div data-testid="confirm-dialog">
  <button data-testid="confirm-delete">Yes, Delete</button>
  <button data-testid="confirm-cancel">Cancel</button>
</div>
```

## Implementation Checklist

### For Each Component File:
- [ ] Add data-testid to main container elements
- [ ] Add data-testid to interactive elements (buttons, inputs, links)
- [ ] Add data-testid to dynamic content areas
- [ ] Add data-testid to error and success message containers
- [ ] Add data-testid to loading states

### Best Practices:
1. **Naming Convention**: Use kebab-case (e.g., `data-testid="user-menu-button"`)
2. **Be Descriptive**: Name should clearly describe the element's purpose
3. **Be Specific**: Include context when needed (e.g., `nav-login-button` vs just `login-button`)
4. **Consistency**: Use consistent naming patterns across components
5. **Avoid Dynamic Values**: Don't use dynamic values in data-testid attributes

### Example Implementation:

```jsx
// Before
<button className="btn btn-primary" onClick={handleLogin}>
  Login
</button>

// After
<button
  className="btn btn-primary"
  data-testid="login-button"
  onClick={handleLogin}
>
  Login
</button>
```

## Testing the Implementation

After adding data-testid attributes, you can test them in browser dev tools:

```javascript
// In browser console
document.querySelector('[data-testid="login-button"]')
document.querySelectorAll('[data-testid="photographer-card"]')
```

## Integration Steps

1. **Add attributes component by component**
2. **Start with most critical user flows**
3. **Test each component after adding attributes**
4. **Update tests if selector changes are needed**
5. **Document any custom or complex selectors**

This systematic approach ensures that all E2E tests have reliable selectors and can run consistently across different environments.