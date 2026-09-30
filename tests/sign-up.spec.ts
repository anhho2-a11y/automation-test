import {test, expect} from '@playwright/test';
// import {getOtp} from './yopmail';
const name = '';
const email = 'duppeudiyefoi-2540@yopmail.com';
const password = 'Anh2912@'
// đăng kí thành công
test ('sign-up with email pw', async ({page}) => {
    await page.goto('https://dev.saydi.ai/signup');
    await page.locator('//input[@id="signup-name"]').fill(name);
    await page.locator('//input[@id="signup-email"]').fill(email);
    await page.locator('//input[@id="signup-password"]').fill(password);
    await page.locator('//button[@type="submit"]').click();
    // const otp = await getOtp(request, email);
    await page.locator('//input[@id="otp-code"]').fill('123456');
    await page.locator('//button[@type="submit"]').click();

})