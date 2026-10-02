import { test, expect } from '@playwright/test';
import data from './email.json';

test.describe('sign-in', () => {
  for (const account of data.account) {
    test(`sign-in: ${account.case}`, async ({ page }) => {
      await page.goto('https://dev.saydi.ai/login-new');

      const emailInput = page.locator('#login-email');
      const passwordInput = page.locator('#login-password');

      await emailInput.fill(account.email);
      await passwordInput.fill(account.password);
      await page.locator('button[type="submit"]').click();

      if (account.case === 'valid') {
        await page.waitForURL('https://dev.saydi.ai/console');
      } else if (account.email === '' || account.password === '') {
        const emptyInput = account.email === '' ? emailInput : passwordInput;
        const isRequired = await emptyInput.evaluate(
          (element) => (element as HTMLInputElement).validity.valueMissing,
        );

        expect(isRequired).toBe(true);
      } else if (account.case === 'invalid_email_format') {
        await expect(page.getByText('Failed to login with email')).toBeVisible();
      } else {
        await expect(
          page.getByText('Incorrect email or password. Please try again.'),
        ).toBeVisible();
      }
    });
  }
});


// thiếu tcs cho những cái htlm mà browser hiển thị ra, ví dụ như: "Please fill out this field" hoặc "Incorrect email or password. Please try again." hoặc "Failed to login with email" thì cần phải viết thêm tcs để kiểm tra những cái này.