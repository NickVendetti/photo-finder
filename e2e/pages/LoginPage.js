import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = '[data-testid="email-input"]';
    this.passwordInput = '[data-testid="password-input"]';
    this.loginButton = '[data-testid="login-button"]';
    this.registerLink = '[data-testid="register-link"]';
    this.errorMessage = '[data-testid="error-message"]';
    this.loginForm = '[data-testid="login-form"]';
  }

  async goto() {
    await super.goto('/login');
    await this.waitForPageLoad();
  }

  async login(email, password) {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage() {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return null;
  }

  async clickRegisterLink() {
    await this.click(this.registerLink);
  }

  async isLoginFormVisible() {
    return await this.isVisible(this.loginForm);
  }
}