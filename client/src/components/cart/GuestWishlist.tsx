'use client';

import { addToCartGuest } from "@/api/contentApi";
import { useState, useEffect } from "react";
import ErrorImage from "../items/ErrorImage";
import { formatGia } from "@/redux/utils";
import { useGuestWishlist } from "@/hooks/useGuestWishlist";
import { removeFromWishlist } from "@/api/authApi";
import Link from "next/link";

export default function GuestWishlist() {
    const {
        wishlist,
        loading,
        error,
        refreshWishlist,
        getTotalItems
    } = useGuestWishlist();

    const [removingItems, setRemovingItems] = useState<string[]>([]);
    const [addingToCartItems, setAddingToCartItems] = useState<string[]>([]);

    // Auto-refresh wishlist when wishlist events occur
    useEffect(() => {
        // console.log("❤️ [GuestWishlist] Setting up wishlistUpdated event listener...");

        const handleWishlistUpdate = (event: any) => {
            // console.log("🔄 [GuestWishlist] Received wishlistUpdated event:", event.detail);
            // console.log("🔄 [GuestWishlist] About to call refreshWishlist...");
            refreshWishlist();
            // console.log("🔄 [GuestWishlist] refreshWishlist called");
        };

        window.addEventListener('wishlistUpdated', handleWishlistUpdate);
        // console.log("❤️ [GuestWishlist] Event listener added successfully");

        return () => {
            // console.log("❤️ [GuestWishlist] Removing wishlistUpdated event listener...");
            window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
        };
    }, [refreshWishlist]);

    // Tạm thời comment
    // const { alertState, showConfirm, showError, showToast, closeAlert } = useCustomAlert();  

    const wishlistCount = getTotalItems();

    // Xử lý xóa sản phẩm khỏi danh sách yêu thích
    const handleRemoveItem = async (idpart: string, productName: string) => {
        // console.log("❤️ [GuestWishlist][handleRemoveItem] Function called");
        // console.log("❤️ [GuestWishlist][handleRemoveItem] incoming:", { idpart, productName });

        if (!idpart) {
            console.error("❌ [GuestWishlist][handleRemoveItem] idpart rỗng/undefined");
            // showError("Lỗi", "Không xác định được sản phẩm để xóa (id rỗng).");
            alert("Không xác định được sản phẩm để xóa (id rỗng)");
            return;
        }

        setRemovingItems(prev => [...prev, idpart]);
        try {
            // console.log("❤️ [GuestWishlist][handleRemoveItem] CALL removeFromWishlist with idpart:", idpart);
            const result = await removeFromWishlist(idpart);
            // console.log("❤️ [GuestWishlist][handleRemoveItem] RESULT:", result);
            // LUÔN LUÔN refresh wishlist sau khi gọi API xóa
            // console.log("🔄 [GuestWishlist][handleRemoveItem] Force refresh wishlist to get updated state");
            await refreshWishlist();

            // Dispatch event để header và các components khác cập nhật
            window.dispatchEvent(new CustomEvent('wishlistUpdated', {
                detail: {
                    productId: idpart,
                    action: 'remove',
                    productName: productName
                }
            }));
            // console.log("🔄 [GuestWishlist][handleRemoveItem] Dispatched wishlistUpdated event");

            // Hiển thị thông báo thành công
            // showToast(`Đã xóa "${productName}" khỏi danh sách yêu thích!`, 'success');
            alert(`Đã xóa "${productName}" khỏi danh sách yêu thích!`);
        } catch (error) {
            console.error("❌ [GuestWishlist][handleRemoveItem] Error:", error);
            // showError("Lỗi", "Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.");
            alert("Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại");
        } finally {
            setRemovingItems(prev => prev.filter(id => id !== idpart));
        }
    };

    // Xử lý chuyển sản phẩm vào giỏ hàng
    const handleAddToCart = async (productId: string, productName: string) => {
        // console.log("🛒 [handleAddToCart] Function called");
        // console.log("🛒 [handleAddToCart] incoming:", { productId, productName });

        if (!productId) {
            console.error("❌ [handleAddToCart] productId rỗng/undefined");
            // showError("Lỗi", "Không xác định được sản phẩm để thêm vào giỏ hàng.");
            alert("Không xác định được sản phẩm để thêm vào giỏ hàng.");
            return;
        }

        setAddingToCartItems(prev => [...prev, productId]);

        try {
            // console.log("🛒 [handleAddToCart] CALL addToCartGuest with productId:", productId);
            const result = await addToCartGuest(productId);
            // console.log("🛒 [handleAddToCart] RESULT:", result);

            // Dispatch event để header cập nhật cart count
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: {
                    productId: productId,
                    action: 'add',
                    productName: productName
                }
            }));

            // Hiển thị thông báo thành công
            // showToast(`Đã thêm "${productName}" vào giỏ hàng`, 'success');
            alert(`Đã thêm "${productName}" vào giỏ hàng`)

        } catch (error) {
            console.error("❌ [handleAddToCart] Error:", error);
            // showError("Lỗi", "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
            alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.')
        } finally {
            setAddingToCartItems(prev => prev.filter(id => id !== productId));
        }
    };

    if (loading) {
        return (
            <div className="modern-wishlist loading">
                <div className="wishlist-header">
                    <h5><i className="fas fa-heart"></i> Danh sách yêu thích</h5>
                </div>
                <div className="loading-state">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Đang tải...</span>
                    </div>
                    <p>Đang tải danh sách yêu thích...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="modern-wishlist error">
                <div className="wishlist-header">
                    <h5><i className="fas fa-heart"></i> Danh sách yêu thích</h5>
                </div>
                <div className="error-state">
                    <i className="fas fa-exclamation-triangle"></i>
                    <p>{error}</p>
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={refreshWishlist}
                    >
                        <i className="fas fa-redo"></i> Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
        return (
            <h2 className="text-danger">Danh sách đang trống.</h2>
        );
    }

    return (
        <div className="modern-wishlist">
            <div className="wishlist-items">
                {wishlist.items.map((item: any, index: any) => (
                    <div key={index} className="modern-wishlist-item row shadow-sm roudend p-3">
                        <div className="item-image col-2">
                            {item.image && (
                                <ErrorImage
                                    src={item.image}
                                    alt={item.partName}
                                    width={50}
                                    height={50}
                                    className="rounded"
                                    style={{ objectFit: 'cover' }}
                                />
                            )}
                        </div>

                        <div className="item-details col-8">
                            <Link href={`/san-pham/${item.link}-${item.id}`} className="item-name">{item.partName}</Link>
                        </div>

                        <div className="item-actions col-2 d-flex">
                            <button
                                className="add-to-cart-btn btn btn-success"
                                onClick={() => handleAddToCart(item.id, item.partName)}
                                disabled={addingToCartItems.includes(item.id)}
                                title="Thêm vào giỏ hàng"
                            // style={{ 
                            //   minWidth: '32px', 
                            //   minHeight: '32px',
                            //   display: 'flex',
                            //   alignItems: 'center',
                            //   justifyContent: 'center',
                            //   marginRight: '8px',
                            //   color: '#28a745',
                            //   border: 'none',
                            //   borderRadius: '4px'
                            // }}
                            >
                                {addingToCartItems.includes(item.id) ? (
                                    <div className="spinner-border spinner-border-sm">
                                        {/* <span className="sr-only">Loading...</span> */}
                                    </div>
                                ) : (
                                    <i style={{ fontSize: '20px', fontWeight: 'bold', lineHeight: '1' }}>+</i>
                                )}
                            </button>

                            <button
                                className="remove-btn btn btn-danger"
                                onClick={() => handleRemoveItem(item.id, item.partName)}
                                disabled={removingItems.includes(item.id)}
                                title="Xóa khỏi danh sách yêu thích"
                                style={{
                                    minWidth: '32px',
                                    minHeight: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {removingItems.includes(item.id) ? (
                                    <div className="spinner-border spinner-border-sm">
                                        {/* <span className="sr-only">Loading...</span> */}
                                    </div>
                                ) : (
                                    <>
                                        <i className="fas fa-heart-broken" style={{ fontSize: '13px', marginRight: '2px' }}></i>
                                        {/* <span style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1' }}>×</span> */}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Alert Component */}
            {/* <CustomAlert
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.config?.title || ''}
                message={alertState.config?.message || ''}
                type={alertState.config?.type || 'info'}
                onConfirm={alertState.onConfirm}
                confirmText={alertState.config?.confirmText}
                cancelText={alertState.config?.cancelText}
            /> */}
        </div>
    );
}