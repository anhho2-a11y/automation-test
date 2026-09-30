// yopmail.ts
export async function getOtp(request: any, emailPrefix: string): Promise<string> {
  const rssUrl = `https://yopmail.com/en/rss?login=${emailPrefix}`;

  for (let i = 0; i < 10; i++) {
    const response = await request.get(rssUrl);
    const text = await response.text();
    
    // Tìm chuỗi 6 số OTP
    const match = text.match(/\b\d{6}\b/);
    if (match) return match[0];

    await new Promise((res) => setTimeout(res, 10000)); // Chờ 3s
  }
  throw new Error('Không nhận được mã OTP!');
}