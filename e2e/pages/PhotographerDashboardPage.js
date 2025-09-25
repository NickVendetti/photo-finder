import { BasePage } from './BasePage.js';

export class PhotographerDashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.dashboard = '[data-testid="photographer-dashboard"]';
    this.portfolioSection = '[data-testid="portfolio-section"]';
    this.uploadPhotoButton = '[data-testid="upload-photo-button"]';
    this.fileInput = '[data-testid="file-input"]';
    this.photoTitleInput = '[data-testid="photo-title-input"]';
    this.photoDescriptionInput = '[data-testid="photo-description-input"]';
    this.uploadButton = '[data-testid="upload-button"]';
    this.photoGrid = '[data-testid="photo-grid"]';
    this.photoCard = '[data-testid="photo-card"]';
    this.deletePhotoButton = '[data-testid="delete-photo-button"]';
    this.editPhotoButton = '[data-testid="edit-photo-button"]';
    this.bookingsSection = '[data-testid="bookings-section"]';
    this.bookingCard = '[data-testid="booking-card"]';
    this.acceptBookingButton = '[data-testid="accept-booking-button"]';
    this.rejectBookingButton = '[data-testid="reject-booking-button"]';
    this.profileSection = '[data-testid="profile-section"]';
    this.editProfileButton = '[data-testid="edit-profile-button"]';
    this.successMessage = '[data-testid="success-message"]';
    this.errorMessage = '[data-testid="error-message"]';
  }

  async goto() {
    await super.goto('/profile-dashboard');
    await this.waitForPageLoad();
  }

  async uploadPhoto(filePath, title, description) {
    await this.click(this.uploadPhotoButton);
    await this.page.setInputFiles(this.fileInput, filePath);
    await this.fill(this.photoTitleInput, title);
    await this.fill(this.photoDescriptionInput, description);
    await this.click(this.uploadButton);
  }

  async getPhotoCards() {
    return await this.page.locator(this.photoCard).all();
  }

  async getPhotoCount() {
    const cards = await this.getPhotoCards();
    return cards.length;
  }

  async deletePhoto(index = 0) {
    const deleteButtons = this.page.locator(this.deletePhotoButton);
    await deleteButtons.nth(index).click();
  }

  async editPhoto(index = 0) {
    const editButtons = this.page.locator(this.editPhotoButton);
    await editButtons.nth(index).click();
  }

  async getBookingCards() {
    return await this.page.locator(this.bookingCard).all();
  }

  async getBookingCount() {
    const cards = await this.getBookingCards();
    return cards.length;
  }

  async acceptBooking(index = 0) {
    const acceptButtons = this.page.locator(this.acceptBookingButton);
    await acceptButtons.nth(index).click();
  }

  async rejectBooking(index = 0) {
    const rejectButtons = this.page.locator(this.rejectBookingButton);
    await rejectButtons.nth(index).click();
  }

  async editProfile() {
    await this.click(this.editProfileButton);
  }

  async isDashboardVisible() {
    return await this.isVisible(this.dashboard);
  }

  async isPortfolioSectionVisible() {
    return await this.isVisible(this.portfolioSection);
  }

  async isBookingsSectionVisible() {
    return await this.isVisible(this.bookingsSection);
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