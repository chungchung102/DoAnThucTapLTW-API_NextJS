import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const {
    id,
    wishlistId,
    CustomerName,
    Address,
    EmailAddress,
    Tel,
    maxacnhan,
  } = req.body;

  const params = new URLSearchParams({
    CustomerName,
    Address,
    EmailAddress,
    Tel,
    maxacnhan,
  });

  try {
    // Tạo cookie string từ các trường nhập vào
    const cookieString = [
      `wishlistMabaogia=${wishlistId || ''}`,
      `CustomerName=${encodeURIComponent(CustomerName || '')}`,
      `Address=${encodeURIComponent(Address || '')}`,
      `EmailAddress=${encodeURIComponent(EmailAddress || '')}`,
      `Tel=${Tel || ''}`,
      `DathangMabaogia=${id || ''}`,
    ].join('; ');

    const apiRes = await fetch(`https://demodienmay.125.atoz.vn/ww1/save.dathang.asp?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookieString,
      },
      body: params.toString(),
    });
    const text = await apiRes.text();

    // Set các cookie như ảnh vào response header
    res.setHeader('Set-Cookie', [
      `DathangMabaogia=${id || ''}; Path=/; Expires=Sat, 23 Aug 2025 17:00:00 GMT`,
      `Tel=${Tel || ''}; Path=/; Expires=Mon, 24 Aug 2026 17:00:00 GMT`,
      `EmailAddress=${encodeURIComponent(EmailAddress || '')}; Path=/; Expires=Mon, 24 Aug 2026 17:00:00 GMT`,
      `CustomerName=${encodeURIComponent(CustomerName || '')}; Path=/; Expires=Mon, 24 Aug 2026 17:00:00 GMT`,
      `Address=${encodeURIComponent(Address || '')}; Path=/; Expires=Mon, 24 Aug 2026 17:00:00 GMT`,
    ]);

    res.status(200).json({ success: true, data: text });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gửi đơn hàng thất bại' });
  }
}
