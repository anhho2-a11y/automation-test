import {test, expect} from '@playwright/test';
import {getOtp} from './yopmail';
const name = '';
// Email random để tránh bị rate-limit "Please wait before requesting another code."
const emailPrefix = `duppeudiyefoi-${Date.now()}`;
const email = `${emailPrefix}@yopmail.com`;
const password = 'Anh2912@'
// đăng kí thành công
test ('sign-up with email pw', async ({page, request}) => {
    await page.goto('https://dev.saydi.ai/signup');
    await page.locator('//input[@id="signup-name"]').fill(name);
    await page.locator('//input[@id="signup-email"]').fill(email);
    await page.locator('//input[@id="signup-password"]').fill(password);
    await page.locator('//button[@type="submit"]').click();

    // Nếu bị rate-limit, form vẫn ở lại trang signup thay vì chuyển sang OTP.
    // Assert rõ để lỗi dễ hiểu hơn timeout mơ hồ.
    await expect(page.getByText('Please wait before requesting another code.')).toBeHidden({timeout: 5000}).catch(() => {
        throw new Error('Bị rate-limit khi gửi mã OTP, hãy đổi email khác.');
    });

    const otp = await getOtp(request, emailPrefix);
    // Component OTP gồm 6 ô input riêng, chỉ ô đầu có id="otp-code".
    // Dùng pressSequentially để giả lập gõ tay, giúp app tự nhảy focus qua từng ô.
    await page.locator('//input[@id="otp-code"]').pressSequentially(otp, {delay: 100});
    await page.getByRole('button', {name: 'Verify'}).click();

})