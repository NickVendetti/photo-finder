import { BasePage } from './BasePage.js';

export class BookingManagerPage extends BasePage {
  constructor(page) {
    super(page);
    this.bookingManager = '[data-testid="booking-manager"]';
    this.bookingList = '[data-testid="booking-list"]';
    this.bookingCard = '[data-testid="booking-card"]';
    this.bookingDate = '[data-testid="booking-date"]';
    this.bookingTime = '[data-testid="booking-time"]';
    this.bookingType = '[data-testid="booking-type"]';
    this.bookingClient = '[data-testid="booking-client"]';
    this.bookingStatus = '[data-testid="booking-status"]';
    this.acceptButton = '[data-testid="accept-booking-button"]';
    this.rejectButton = '[data-testid="reject-booking-button"]';
    this.completeButton = '[data-testid="complete-booking-button"]';
    this.filterSelect = '[data-testid="booking-filter-select"]';
    this.searchInput = '[data-testid="booking-search-input"]';
    this.noBookingsMessage = '[data-testid="no-bookings-message"]';
    this.successMessage = '[data-testid="success-message"]';
    this.errorMessage = '[data-testid="error-message"]';
  }

  async goto() {
    await super.goto('/manage-bookings');
    await this.waitForPageLoad();
  }

  async getBookingCards() {
    return await this.page.locator(this.bookingCard).all();
  }

  async getBookingCount() {
    const cards = await this.getBookingCards();
    return cards.length;
  }

  async acceptBooking(index = 0) {
    const acceptButtons = this.page.locator(this.acceptButton);
    await acceptButtons.nth(index).click();
  }

  async rejectBooking(index = 0) {
    const rejectButtons = this.page.locator(this.rejectButton);
    await rejectButtons.nth(index).click();
  }

  async completeBooking(index = 0) {
    const completeButtons = this.page.locator(this.completeButton);
    await completeButtons.nth(index).click();
  }

  async filterBookings(status) {
    await this.page.selectOption(this.filterSelect, status);
  }

  async searchBookings(query) {
    await this.fill(this.searchInput, query);
  }

  async getBookingData(index = 0) {
    const cards = await this.getBookingCards();
    if (cards.length > index) {
      const card = cards[index];
      return {
        date: await card.locator(this.bookingDate).textContent(),
        time: await card.locator(this.bookingTime).textContent(),
        type: await card.locator(this.bookingType).textContent(),
        client: await card.locator(this.bookingClient).textContent(),
        status: await card.locator(this.bookingStatus).textContent()
      };
    }
    return null;
  }

  async isBookingManagerVisible() {
    return await this.isVisible(this.bookingManager);
  }

  async isNoBookingsMessageVisible() {
    return await this.isVisible(this.noBookingsMessage);
  }

  async getSuccessMessage() {
    if (await this.isVisible(this.successMessage)) {
      return await this.getText(this.successMessage);
    }
    return null;
  }

  async getErrorMessage() {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return null;
  }
}