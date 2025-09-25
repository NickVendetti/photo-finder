import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.navbar = '[data-testid="navbar"]';
    this.loginButton = '[data-testid="nav-login-button"]';
    this.registerButton = '[data-testid="nav-register-button"]';
    this.discoverButton = '[data-testid="discover-button"]';
    this.heroSection = '[data-testid="hero-section"]';
    this.heroTitle = '[data-testid="hero-title"]';
    this.heroDescription = '[data-testid="hero-description"]';
    this.featuresSection = '[data-testid="features-section"]';
    this.userMenuButton = '[data-testid="user-menu-button"]';
    this.logoutButton = '[data-testid="logout-button"]';
  }

  async goto() {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  async clickLogin() {
    await this.click(this.loginButton);
  }

  async clickRegister() {
    await this.click(this.registerButton);
  }

  async clickDiscover() {
    await this.click(this.discoverButton);
  }

  async isNavbarVisible() {
    return await this.isVisible(this.navbar);
  }

  async isHeroSectionVisible() {
    return await this.isVisible(this.heroSection);
  }

  async getHeroTitle() {
    return await this.getText(this.heroTitle);
  }

  async getHeroDescription() {
    return await this.getText(this.heroDescription);
  }

  async isUserLoggedIn() {
    return await this.isVisible(this.userMenuButton);
  }

  async logout() {
    await this.click(this.userMenuButton);
    await this.click(this.logoutButton);
  }
}