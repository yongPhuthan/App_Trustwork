import { by, device, expect, element } from 'detox';

describe('SignUpScreen', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have email input', async () => {
    await expect(element(by.id('emailInput'))).toBeVisible();
  });

  it('should have password input', async () => {
    await expect(element(by.id('passwordInput'))).toBeVisible();
  });

  it('should have confirm password input', async () => {
    await expect(element(by.id('confirmPasswordInput'))).toBeVisible();
  });

  it('should have registration code input', async () => {
    await expect(element(by.id('registrationCodeInput'))).toBeVisible();
  });

  it('should have register button', async () => {
    await expect(element(by.id('registerButton'))).toBeVisible();
  });

  it('should show error when passwords do not match', async () => {
    await element(by.id('emailInput')).typeText('test@test.com');
    await element(by.id('passwordInput')).typeText('password1');
    await element(by.id('confirmPasswordInput')).typeText('password2');
    await element(by.id('registerButton')).tap();
    
    // Assuming error is displayed via a testId errorText
    await expect(element(by.id('errorText'))).toBeVisible();
  });

  // Other test cases...
});
