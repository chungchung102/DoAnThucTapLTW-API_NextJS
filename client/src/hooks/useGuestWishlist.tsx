import { useEffect, useState } from "react";
import { clearExpiredWishlistCookie, CurrentWishlist, getCurrentWishlist, WishlistItem } from "@/api/contentApi";
import { getWishlistMabaogiaCookie } from "@/api/authApi";

export function useGuestWishlist() {
    const [wishlist, setWishlist] = useState<CurrentWishlist | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Lấy wishlist hiện tại
    const fetchWishlist = async () => {
        setLoading(true);
        setError(null);

        try {
            // Xóa invalid cookies trước khi bắt đầu
            clearExpiredWishlistCookie();

            // Kiểm tra và lấy WishlistMabaogia nếu chưa có
            const existingWishlist = localStorage.getItem('WishlistMabaogia');
            if (!existingWishlist) {
                // console.log('❤️ [useGuestWishlist] WishlistMabaogia not found, fetching from cookie API...');
                await getWishlistMabaogiaCookie();
            }

            const wishlistData = await getCurrentWishlist();
            setWishlist(wishlistData);

            // Lưu ASP Session Cookie vào localStorage để đồng bộ với API xóa
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name.startsWith('ASPSESSIONID')) {
                    localStorage.setItem('aspSessionName', name);
                    localStorage.setItem('aspSessionValue', value);
                    // console.log('❤️ [useGuestWishlist] Saved ASP Session to localStorage:', name + "=" + value);
                }
                // Lưu WishlistMabaogia nếu có
                if (name === 'WishlistMabaogia') {
                    localStorage.setItem('WishlistMabaogia', value);
                    // console.log('❤️ [useGuestWishlist] Saved WishlistMabaogia to localStorage:', value);
                }
            }

        } catch (err) {
            setError('Không thể tải wishlist');
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    // Refresh wishlist sau khi thêm sản phẩm
    const refreshWishlist = async () => {
        await fetchWishlist();
    };

    // Lấy tổng số lượng sản phẩm trong wishlist
    const getTotalItems = () => {
        if (!wishlist?.items) return 0;
        return wishlist.items.reduce((total: number, item: WishlistItem) => total + item.quantity, 0);
    };

    // Tự động load wishlist khi component mount
    useEffect(() => {
        fetchWishlist();
    }, []);

    return {
        wishlist,
        loading,
        error,
        refreshWishlist,
        getTotalItems,
    };
}
