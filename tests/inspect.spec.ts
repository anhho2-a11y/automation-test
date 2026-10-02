import {test} from '@playwright/test';
test('send otp and inspect mail frame v2', async ({page, context}) => {
  const emailPrefix = `duppeudiyefoi-${Date.now()}`;
  await page.goto('https://dev.saydi.ai/signup');
  await page.locator('//input[@id="signup-name"]').fill('');
  await page.locator('//input[@id="signup-email"]').fill(`${emailPrefix}@yopmail.com`);
  await page.locator('//input[@id="signup-password"]').fill('Anh2912@');
  await page.locator('//button[@type="submit"]').click();
  await page.getByText('Verification Code').first().waitFor();
  console.log('emailPrefix:', emailPrefix);

  const mailPage = await context.newPage();
  await mailPage.goto('https://yopmail.com/en/');
  await mailPage.locator('#login').fill(emailPrefix);
  await mailPage.keyboard.press('Enter');
  await mailPage.waitForTimeout(2000);

  for (let i = 0; i < 24; i++) {
    const mailFrame = mailPage.frame('ifmail');
    const url = mailFrame?.url() ?? 'no-frame';
    if (!url.includes('nomail') && url !== 'no-frame' && url !== 'about:blank') {
      console.log(`attempt ${i} FOUND mail frame url:`, url);
      const bodyText = await mailFrame!.locator('body').innerText();
      console.log('MAIL BODY:', bodyText.slice(0, 1500));
      break;
    }
    console.log(`attempt ${i} url:`, url);
    // click refresh icon inside inbox frame instead of full page reload
    const inboxFrame = mailPage.frame('ifinbox');
    const refreshBtn = inboxFrame?.locator('#refresh, .refresh, [title="Refresh"]').first();
    if (refreshBtn && await refreshBtn.count().catch(() => 0) > 0) {
      await refreshBtn.click().catch(() => {});
    } else {
      await mailPage.reload().catch(() => {});
      await mailPage.waitForTimeout(1500);
    }
    await mailPage.waitForTimeout(5000);
  }
});
