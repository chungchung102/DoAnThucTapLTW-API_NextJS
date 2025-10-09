'use client';

import { useEffect, useState } from "react";
import { formatGia } from "@/redux/utils";
import { useGuestCart } from "@/hooks/useGuestCart";
import ErrorImage from "../items/ErrorImage";
import { removeFromCart } from "@/api/authApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import CustomAlert from "../ui/CustomAlert";

export default function GuestCart() {
    // Modal state and form state (move to top for React rules)
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        address: '',
        email: '',
        phone: '',
        code: ''
    });

    const [recaptchaCode, setRecaptchaCode] = useState('');
    // Lấy id từ cookie
    function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return '';
    }

    // Fetch recapcha code
    useEffect(() => {
        async function fetchRecaptchaCode() {
            try {
                const dathangId = getCookie('DathangMabaogia');
                const wishlistId = getCookie('wishlistMabaogia');
                // Call your own API route instead of the external API
                const res = await fetch('/api/recaptcha', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'DathangMabaogia': dathangId || '',
                        'wishlistMabaogia': wishlistId || '',
                    },
                });
                const text = await res.text();

                setRecaptchaCode(text.trim());
            } catch (err) {
                setRecaptchaCode('');
            }
        }
        fetchRecaptchaCode();
    }, []);

    const {
        cart,
        error,
        refreshCart,
    } = useGuestCart();

    const [removingItems, setRemovingItems] = useState<string[]>([]);
    const { alertState, showError, showToast, closeAlert } = useCustomAlert();

    // Auto-refresh cart khi có sự kiện thêm/xóa sản phẩm
    useEffect(() => {
        const handleCartUpdate = (event: CustomEvent) => {
            console.log('🔄 [GuestCart] Cart updated event received:', event.detail);
            // Refresh cart data
            refreshCart();
        };

        // Listen for cart update events
        window.addEventListener('cartUpdated', handleCartUpdate as EventListener);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
        };
    }, [refreshCart]);

    const totalPrice = cart?.totalAmount || 0; // Tổng giá tiền

    // Xử lý xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = async (idpart: string, productName: string) => {
        console.log("🧪 [handleRemoveItem] Function called");
        console.log("🧪 [handleRemoveItem] incoming:", { idpart, productName });

        if (!idpart) {
            console.error("❌ [handleRemoveItem] idpart rỗng/undefined");
            showError("Lỗi", "Không xác định được sản phẩm để xóa (id rỗng).");
            return;
        }

        setRemovingItems(prev => [...prev, idpart]);
        try {
            console.log("🔥 [handleRemoveItem] CALL removeFromCart with idpart:", idpart);
            const result = await removeFromCart(idpart);
            console.log("🔥 [handleRemoveItem] RESULT:", result);

            // LUÔN LUÔN refresh cart sau khi gọi API xóa, bất kể thành công hay thất bại
            console.log("🔄 [handleRemoveItem] Force refresh cart to get updated state and new session");
            await refreshCart();

            // Dispatch event để header và các components khác cập nhật
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: {
                    productId: idpart,
                    action: 'remove',
                    productName: productName
                }
            }));
            console.log("🔄 [handleRemoveItem] Dispatched cartUpdated event");

            // Hiển thị thông báo thành công
            showToast(`Đã xóa "${productName}" khỏi giỏ hàng`, 'success');

        } catch (error) {
            console.error("❌ [handleRemoveItem] Error:", error);
            showError("Lỗi", "Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại sau.");
        } finally {
            setRemovingItems(prev => prev.filter(id => id !== idpart));
        }
    };

    // Thêm hàm gửi đơn hàng
    const handleSubmitOrder = async () => {
        try {
            const dathangId = getCookie('DathangMabaogia');
            const wishlistId = getCookie('wishlistMabaogia');
            const res = await fetch('/api/save-dathang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: dathangId,
                    wishlistId,
                    CustomerName: form.name,
                    Address: form.address,
                    EmailAddress: form.email,
                    Tel: form.phone,
                    maxacnhan: form.code,
                }),
            });
            const result = await res.json();
            if (result.success) {
                // showToast('Đặt hàng thành công!', 'success');
                alert('Đặt hàng thành công!')
                setShowCheckoutModal(false);

                // Xóa toàn bộ cookie ở mọi path và domain, xóa cả localStorage/sessionStorage
                const cookies = document.cookie.split(';');
                const hostname = window.location.hostname;
                const paths = ['/', '', window.location.pathname];
                const domains = ['', hostname, '.' + hostname];
                cookies.forEach(cookie => {
                    const eqPos = cookie.indexOf('=');
                    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                    paths.forEach(path => {
                        domains.forEach(domain => {
                            let cookieStr = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=' + path + ';';
                            if (domain) cookieStr += 'domain=' + domain + ';';
                            document.cookie = cookieStr;
                        });
                    });
                });
                // Xóa localStorage và sessionStorage
                try { localStorage.clear(); } catch (e) { }
                try { sessionStorage.clear(); } catch (e) { }

                // Reload lại trang
                window.location.reload();
            } else {
                // showError('Lỗi', result.message || 'Đặt hàng thất bại');
                alert(result.message || 'Đặt hàng thất bại');
            }
        } catch (err) {
            // showError('Lỗi', 'Không thể gửi đơn hàng');
            alert('Không thể gửi đơn hàng');
        }
    };

    if (error) {
        return (
            <div className="modern-cart error">
                <div className="cart-header">
                    <h5><i className="fas fa-shopping-cart"></i> Giỏ hàng</h5>
                </div>
                <div className="error-state">
                    <i className="fas fa-exclamation-triangle"></i>
                    <p>{error}</p>
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={refreshCart}
                    >
                        <i className="fas fa-redo"></i> Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <h6 className="text-danger">Giỏ hàng trống. Hãy thêm sản phẩm vào giỏ hàng!</h6>
        );
    }

    return (
        <div className="modern-cart">
            <div className="cart-items">
                {cart.items.map((item, index) => (
                    <div key={index} className="modern-cart-item row align-items-center">
                        <div className="item-image col-2">
                            {item.image && (
                                <ErrorImage
                                    src={item.image}
                                    alt={item.partName}
                                    width={100}
                                    className="rounded"
                                    style={{ objectFit: 'contain' }}
                                />
                            )}
                        </div>
                        <div className="item-details col-8 row align-items-center">
                            <h6 className="item-name col-6">{item.partName}</h6>
                            <p className="price col-3">{formatGia(item.price.toString())}</p>
                            <p className="quantity col-3">SL: {item.quantity}</p>
                        </div>
                        <button
                            className="remove-btn col-2 btn btn-danger"
                            onClick={() => handleRemoveItem(item.id, item.partName)}
                            disabled={removingItems.includes(item.id)}
                            title="Xóa sản phẩm">
                            <FontAwesomeIcon icon={faTrash} style={{ fontSize: '13px', marginRight: '2px' }} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="cart-footer">
                <div className="total-amount">
                    <span>Tổng cộng: </span>
                    <strong>{formatGia(totalPrice.toString())}</strong>
                </div>
                <div className="cart-actions">
                    <button className="btn-checkout" onClick={() => setShowCheckoutModal(true)}>
                        <i className="fas fa-credit-card"></i>
                        Thanh toán
                    </button>
                </div>
            </div>
            {showCheckoutModal && (
                <div
                    className="checkout-modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        className="checkout-modal"
                        style={{
                            background: 'white',
                            borderRadius: '10px',
                            padding: '0',
                            minWidth: '320px',
                            width: '90vw',
                            maxWidth: '900px',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '10px',
                                padding: '20px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div style={{ flex: 2, minWidth: 0 }}>
                                {cart.items.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '18px',
                                            borderBottom: '1px solid #eee',
                                            paddingBottom: '8px',
                                            flexWrap: 'wrap',
                                            position: 'relative',
                                        }}
                                    >
                                        <img
                                            src={`https://demodienmay.125.atoz.vn/${item.image}`}
                                            alt={item.partName}
                                            style={{
                                                width: 60,
                                                height: 60,
                                                objectFit: 'contain',
                                                marginRight: 12,
                                                borderRadius: 8,
                                                background: '#f6f6f6',
                                            }}
                                        />
                                        <div style={{ flex: 1, minWidth: 120 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: 16 }}>{item.partName}</div>
                                            <div style={{ color: '#888', fontSize: 13 }}>Ghi chú</div>
                                        </div>
                                        {/* Đưa input và giá sát phải */}
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-end',
                                            marginLeft: 'auto',
                                            minWidth: 80,
                                        }}>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min={1}
                                                style={{
                                                    width: 48,
                                                    textAlign: 'center',
                                                    borderRadius: 6,
                                                    border: '1px solid #ccc',
                                                    padding: '4px',
                                                    fontSize: 16,
                                                    background: '#f9f9f9',
                                                    marginBottom: 4,
                                                }}
                                                readOnly
                                            />
                                            <div
                                                style={{
                                                    fontWeight: 'bold',
                                                    minWidth: 50,
                                                    textAlign: 'right',
                                                    fontSize: 16,
                                                }}
                                            >
                                                {formatGia(item.price.toString())}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div
                                    style={{
                                        textAlign: 'right',
                                        fontWeight: 'bold',
                                        marginTop: 18,
                                        fontSize: 18,
                                    }}
                                >
                                    Tổng cộng: {formatGia(totalPrice.toString())}
                                </div>
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    background: '#002aff',
                                    borderRadius: 16,
                                    padding: '20px 16px',
                                    color: 'white',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 14,
                                    minWidth: 220,
                                    position: 'relative',
                                    alignSelf: 'flex-start',
                                }}
                            >
                                <button
                                    onClick={() => setShowCheckoutModal(false)}
                                    style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: 28,
                                        color: '#fff',
                                        cursor: 'pointer',
                                        zIndex: 10000,
                                    }}
                                    title="Đóng"
                                >
                                    ×
                                </button>
                                <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>Họ tên</div>
                                <input
                                    style={{
                                        background: '#6666cc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: 12,
                                        marginBottom: 6,
                                        fontSize: 16,
                                        width: '100%',
                                    }}
                                    placeholder="Họ tên"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                />
                                <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>Địa chỉ</div>
                                <input
                                    style={{
                                        background: '#6666cc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: 12,
                                        marginBottom: 6,
                                        fontSize: 16,
                                        width: '100%',
                                    }}
                                    placeholder="Địa chỉ"
                                    value={form.address}
                                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                />
                                <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>Địa chỉ email</div>
                                <input
                                    style={{
                                        background: '#6666cc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: 12,
                                        marginBottom: 6,
                                        fontSize: 16,
                                        width: '100%',
                                    }}
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                />
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: 120 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>Điện thoại</div>
                                        <input
                                            style={{
                                                background: '#6666cc',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 8,
                                                padding: 12,
                                                marginBottom: 6,
                                                fontSize: 16,
                                                width: '100%',
                                            }}
                                            placeholder="Điện thoại"
                                            value={form.phone}
                                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 120 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>Code {recaptchaCode || '...'}</div>
                                        <input
                                            style={{
                                                background: '#6666cc',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 8,
                                                padding: 12,
                                                marginBottom: 6,
                                                fontSize: 16,
                                                width: '100%',
                                            }}
                                            placeholder="Mã xác nhận"
                                            value={form.code}
                                            onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                                        />
                                        {/* <div style={{ fontSize: 13, color: '#fff', marginTop: 2 }}>Code: {recaptchaCode || '...'}</div> */}
                                    </div>
                                </div>
                                <button
                                    style={{
                                        background: '#1877f2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: 16,
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                        marginTop: 10,
                                        width: '100%',
                                    }}
                                    onClick={handleSubmitOrder}
                                >
                                    Gửi đi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
            {/* Custom Alert Component */}
            <CustomAlert
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.config?.title || ''}
                message={alertState.config?.message || ''}
                type={alertState.config?.type || 'info'}
                onConfirm={alertState.onConfirm}
                confirmText={alertState.config?.confirmText}
                cancelText={alertState.config?.cancelText}
            />
        </div >
    );
}




