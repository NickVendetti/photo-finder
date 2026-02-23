import { BasePage } from './BasePage.js';

export class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = '[data-testid="username-input"]';
    this.emailInput = '[data-testid="email-input"]';
    this.passwordInput = '[data-testid="password-input"]';
    this.continueButton = '[data-testid="continue-button"]';
    this.roleUserCard = '[data-testid="role-user-card"]';
    this.rolePhotographerCard = '[data-testid="role-photographer-card"]';
    this.loginLink = '[data-testid="login-link"]';
    this.errorMessage = '[data-testid="error-message"]';
    this.successMessage = '[data-testid="success-message"]';
    this.registerForm = '[data-testid="register-form"]';
  }

  async goto() {
    await super.goto('/register');
    await this.waitForPageLoad();
  }

  async register(username, email, password, userType = 'USER') {
    await this.fill(this.usernameInput, username);
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.continueButton);
    if (userType === 'PHOTOGRAPHER') {
      await this.click(this.rolePhotographerCard);
    } else {
      await this.click(this.roleUserCard);
    }
  }

  async getErrorMessage() {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return null;
  }

  async getSuccessMessage() {
    if (await this.isVisible(this.successMessage)) {
      return await this.getText(this.successMessage);
    }
    return null;
  }

  async clickLoginLink() {
    await this.click(this.loginLink);
  }

  async isRegisterFormVisible() {
    return await this.isVisible(this.registerForm);
  }
}