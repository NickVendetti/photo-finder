import { expect } from '@playwright/test';
import users from '../fixtures/users.json';
import photos from '../fixtures/photos.json';
import bookings from '../fixtures/bookings.json';

export class TestHelpers {
  constructor(page, request) {
    this.page = page;
    this.request = request;
    this.baseURL = 'http://localhost:5002';
  }

  // Authentication helpers
  async createUser(userData) {
    const response = await this.request.post(`${this.baseURL}/auth/register`, {
      data: userData
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async loginUser(email, password) {
    const response = await this.request.post(`${this.baseURL}/auth/login`, {
      data: { email, password }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    return data.token;
  }

  async createTestUsers() {
    const createdUsers = {};

    for (const [key, userData] of Object.entries(users)) {
      try {
        const user = await this.createUser(userData);
        createdUsers[key] = user;
      } catch (error) {
        console.log(`User ${key} might already exist`);
      }
    }

    return createdUsers;
  }

  async cleanupTestUsers() {
    // This would require an admin endpoint to delete users
    // For now, we'll rely on database reset
    console.log('Test users cleanup - implement admin cleanup endpoint');
  }

  // Photo helpers
  async uploadPhoto(photoData, token) {
    const response = await this.request.post(`${this.baseURL}/photos`, {
      data: photoData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async createSamplePhotos(token) {
    const uploadedPhotos = [];

    for (const photo of photos.samplePhotos) {
      const uploadedPhoto = await this.uploadPhoto(photo, token);
      uploadedPhotos.push(uploadedPhoto);
    }

    return uploadedPhotos;
  }

  // Booking helpers
  async createBooking(bookingData, token) {
    const response = await this.request.post(`${this.baseURL}/bookings`, {
      data: bookingData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async createSampleBookings(photographerId, userToken) {
    const createdBookings = [];

    for (const booking of bookings.sampleBookings) {
      const bookingData = {
        ...booking,
        photographer_id: photographerId
      };
      const createdBooking = await this.createBooking(bookingData, userToken);
      createdBookings.push(createdBooking);
    }

    return createdBookings;
  }

  // Database helpers
  async resetDatabase() {
    // This would require a test endpoint to reset the database
    console.log('Database reset - implement test database reset endpoint');
  }

  // Utility helpers
  generateRandomEmail() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test${timestamp}${random}@example.com`;
  }

  generateRandomUsername() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `testuser${timestamp}${random}`;
  }

  async waitForResponse(urlPattern) {
    return await this.page.waitForResponse(urlPattern);
  }

  async interceptRequest(urlPattern, mockResponse) {
    await this.page.route(urlPattern, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });
  }

  async takeFullPageScreenshot(name) {
    return await this.page.screenshot({
      path: `e2e-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  async waitForLoadingToComplete() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForFunction(() => {
      const spinner = document.querySelector('[data-testid="loading-spinner"]');
      return !spinner || spinner.style.display === 'none' || !spinner.offsetParent;
    }, {}, { timeout: 10000 });
  }

  // Form helpers
  async fillForm(formData) {
    for (const [selector, value] of Object.entries(formData)) {
      await this.page.fill(selector, value);
    }
  }

  // Assertion helpers
  async expectElementToBeVisible(selector, timeout = 5000) {
    await expect(this.page.locator(selector)).toBeVisible({ timeout });
  }

  async expectElementToHaveText(selector, text, timeout = 5000) {
    await expect(this.page.locator(selector)).toHaveText(text, { timeout });
  }

  async expectUrlToContain(substring) {
    await expect(this.page).toHaveURL(new RegExp(substring));
  }
}

export { users, photos, bookings };