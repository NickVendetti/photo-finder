import { BasePage } from './BasePage.js';

export class BookingPage extends BasePage {
  constructor(page) {
    super(page);
    this.bookingForm = '[data-testid="booking-form"]';
    this.bookingTypeSelect = '[data-testid="booking-type-select"]';
    this.dateInput = '[data-testid="date-input"]';
    this.timeInput = '[data-testid="time-input"]';
    this.submitButton = '[data-testid="submit-booking-button"]';
    this.cancelButton = '[data-testid="cancel-button"]';
    this.photographerInfo = '[data-testid="photographer-info"]';
    this.photographerName = '[data-testid="photographer-name"]';
    this.photographerPortfolio = '[data-testid="photographer-portfolio"]';
    this.confirmationMessage = '[data-testid="confirmation-message"]';
    this.errorMessage = '[data-testid="error-message"]';
    this.bookingPreview = '[data-testid="booking-preview"]';
  }

  async goto(photographerId) {
    await super.goto(`/booking/${photographerId}`);
    await this.waitForPageLoad();
  }

  async createBooking(bookingType, date, time) {
    await this.page.selectOption(this.bookingTypeSelect, bookingType);
    await this.fill(this.dateInput, date);
    await this.fill(this.timeInput, time);
    await this.click(this.submitButton);
  }

  async getPhotographerName() {
    return await this.getText(this.photographerName);
  }

  async isBookingFormVisible() {
    return await this.isVisible(this.bookingForm);
  }

  async isPhotographerInfoVisible() {
    return await this.isVisible(this.photographerInfo);
  }

  async isPhotographerPortfolioVisible() {
    return await this.isVisible(this.photographerPortfolio);
  }

  async getConfirmationMessage() {
    if (await this.isVisible(this.confirmationMessage)) {
      return await this.getText(this.confirmationMessage);
    }
    return null;
  }

  async getErrorMessage() {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return null;
  }

  async cancelBooking() {
    await this.click(this.cancelButton);
  }

  async getBookingPreviewData() {
    if (await this.isVisible(this.bookingPreview)) {
      return {
        visible: true,
        text: await this.getText(this.bookingPreview)
      };
    }
    return { visible: false };
  }
}