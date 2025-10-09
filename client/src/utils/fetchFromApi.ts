const API_HOST = "http://khangtuong.125.atoz.vn";

export async function fetchFromApi(path: string) {
    try {
        const res = await fetch(`${API_HOST}${path}`, {
            cache: "no-store",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            },
        });

        if (!res.ok) {
            throw new Error(`API lỗi: ${res.status} ${res.statusText}`);
        }

        return res;
    } catch (error) {
        console.error("fetchFromApi error:", error);
        throw error;
    }
}
