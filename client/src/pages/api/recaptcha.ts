import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handleRecapcha(req: NextApiRequest, res: NextApiResponse) {
    try {
        const dathangId = req.headers['dathangmabaogia'] || '';
        const wishlistId = req.headers['wishlistmabaogia'] || '';
        const apiRes = await fetch('https://demodienmay.125.atoz.vn/general/recaptcha.asp', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'DathangMabaogia': String(dathangId),
                'wishlistMabaogia': String(wishlistId),
            },
        });
        const text = await apiRes.text();
        res.status(200).send(text);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch recaptcha code' });
    }
}
