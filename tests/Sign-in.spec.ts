import { test, expect } from '@playwright/test';
import data from './email.json';

test.describe('sign-in', () => {
  for (const acc of data.account) {
    test(`sign-in - ${acc.case}`, async ({ page }) => {
      await page.goto('https://dev.saydi.ai/login-new');
      await page.locator('//input[@id="login-email"]').fill(acc.email);
      await page.locator('//input[@id="login-password"]').fill(acc.password);
      await page.locator('//button[@type="submit"]').click();

      if (acc.case === 'valid') {
        await page.waitForURL('https://dev.saydi.ai/console');
        delay: 100000;
      } else if (acc.case === 'invalid_email_format') {
        await expect( 
          page.getByText('Failed to login with email') ).toBeVisible();
            delay: 2000;
      }
      else if (acc.email === '' || acc.password === '') {
        await expect(
          page.getByText('Please fill out this field')).toBeVisible();
            delay: 2000;
        }
        else {
        await expect(
          page.getByText('Incorrect email or password. Please try again.')
        ).toBeVisible();
          delay: 2000;
      }
    });
  }
});

// thiếu tcs cho những cái htlm mà browser hiển thị ra, ví dụ như: "Please fill out this field" hoặc "Incorrect email or password. Please try again." hoặc "Failed to login with email" thì cần phải viết thêm tcs để kiểm tra những cái này.