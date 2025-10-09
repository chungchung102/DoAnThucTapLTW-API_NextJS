// app/api/wishlist/remove/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    console.log("❤️ [API Route] POST method called - Starting remove wishlist process");

    try {
        console.log("❤️ [API Route] Parsing request body...");
        const { idpart, aspSession, wishlistMabaogia } = await request.json();

        console.log("❤️ [API Route] Parsed data:", { idpart, aspSession, wishlistMabaogia });

        if (!idpart) {
            console.log("❤️ [API Route] Missing idpart parameter");
            return NextResponse.json({ success: false, message: 'Missing idpart parameter' }, { status: 400 });
        }

        // Tạo cookie string từ client data
        let cookieString = '';

        if (aspSession && aspSession.name && aspSession.value) {
            cookieString += `${aspSession.name}=${aspSession.value}; `;
            console.log("❤️ [API Route] Added ASP Session to cookies:", aspSession.name + "=" + aspSession.value);
        }

        if (wishlistMabaogia) {
            cookieString += `WishlistMabaogia=${wishlistMabaogia}; `;
            console.log("❤️ [API Route] Added WishlistMabaogia to cookies:", wishlistMabaogia);
        }

        // Thêm cookies từ client (nếu có)
        const clientCookies = request.headers.get('cookie') || '';
        if (clientCookies) {
            cookieString += clientCookies + '; ';
            console.log("❤️ [API Route] Added client cookies:", clientCookies);
        }

        console.log("❤️ [API Route] Final cookie string:", cookieString);

        const apiUrl = 'https://demodienmay.125.atoz.vn/cart/xoawl.asp';
        const params = new URLSearchParams({
            idpart,
            id: wishlistMabaogia || 'default'
        });
        const fullUrl = `${apiUrl}?${params.toString()}`;

        console.log("❤️ [API Route] Calling external API with cookies:", fullUrl);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);

        const upstream = await fetch(fullUrl, {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Cookie': cookieString, // Sử dụng cookie string đã tạo
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            }
        });

        clearTimeout(timer);

        console.log("❤️ [API Route] Fetch completed with status:", upstream.status);
        console.log("❤️ [API Route] Fetch ok:", upstream.ok);
        console.log("❤️ [API Route] Response headers from ASP:", Object.fromEntries(upstream.headers.entries()));

        const body = await upstream.text();
        console.log("❤️ [API Route] Response body:", body.substring(0, 500)); // Chỉ log 500 ký tự đầu

        // Lấy set-cookie headers từ ASP response
        const setCookieHeaders = upstream.headers.get('set-cookie');
        console.log("❤️ [API Route] Set-Cookie headers from ASP:", setCookieHeaders);

        const origin = request.headers.get('origin') || '*';

        const response = NextResponse.json(
            { success: upstream.ok, body },
            {
                status: upstream.status,
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
                    'Access-Control-Allow-Credentials': 'true',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'Surrogate-Control': 'no-store'
                }
            }
        );

        // Forward cookies từ ASP response
        if (setCookieHeaders) {
            response.headers.set('Set-Cookie', setCookieHeaders);
            console.log("❤️ [API Route] Forwarded Set-Cookie headers to client");
        }

        console.log("❤️ [API Route] Response sent successfully");
        return response;

    } catch (error: any) {
        console.error('❤️ [API Route] Error removing from wishlist:', error);

        const origin = request.headers.get('origin') || '*';

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to remove from wishlist',
                error: error.message
            },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
                    'Access-Control-Allow-Credentials': 'true'
                }
            }
        );
    }
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin') || '*';

    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
            'Access-Control-Allow-Credentials': 'true'
        }
    });
}
