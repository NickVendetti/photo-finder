import { BasePage } from './BasePage.js';

export class DiscoveryPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = '[data-testid="search-input"]';
    this.searchButton = '[data-testid="search-button"]';
    this.photographerGrid = '[data-testid="photographer-grid"]';
    this.photographerCard = '[data-testid="photographer-card"]';
    this.photographerName = '[data-testid="photographer-name"]';
    this.photographerPhoto = '[data-testid="photographer-photo"]';
    this.bookButton = '[data-testid="book-button"]';
    this.viewPortfolioButton = '[data-testid="view-portfolio-button"]';
    this.noResultsMessage = '[data-testid="no-results-message"]';
    this.loadingSpinner = '[data-testid="loading-spinner"]';
  }

  async goto() {
    await super.goto('/discover');
    await this.waitForPageLoad();
  }

  async searchPhotographers(query) {
    await this.fill(this.searchInput, query);
    await this.click(this.searchButton);
    await this.waitForLoadComplete();
  }

  async waitForLoadComplete() {
    await this.page.waitForSelector(this.loadingSpinner, { state: 'hidden', timeout: 10000 });
  }

  async getPhotographerCards() {
    return await this.page.locator(this.photographerCard).all();
  }

  async getPhotographerCount() {
    const cards = await this.getPhotographerCards();
    return cards.length;
  }

  async clickBookForPhotographer(index = 0) {
    const bookButtons = this.page.locator(this.bookButton);
    await bookButtons.nth(index).click();
  }

  async clickViewPortfolioForPhotographer(index = 0) {
    const portfolioButtons = this.page.locator(this.viewPortfolioButton);
    await portfolioButtons.nth(index).click();
  }

  async getPhotographerName(index = 0) {
    const names = this.page.locator(this.photographerName);
    return await names.nth(index).textContent();
  }

  async isNoResultsMessageVisible() {
    return await this.isVisible(this.noResultsMessage);
  }

  async isPhotographerGridVisible() {
    return await this.isVisible(this.photographerGrid);
  }
}