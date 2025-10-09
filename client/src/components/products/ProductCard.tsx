import { faHeart, faShoppingCart, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip, faBolt, faWrench, faFloppyDisk, faCompactDisc, faImage, faDesktop } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";
import { addToCartGuest, addToWishlistGuest } from "@/api/contentApi";
import { useToastContext } from "../ui/ToastProvider";

// Tạo interface cho ProductCard
interface ProductCardProps {
    product: {
        id: string;
        tieude: string;
        hinhdaidien: string;
        url: string;
        gia: string;
        giakhuyenmai: string;
        thuonghieu?: Array<{ tengoi: string; url: string }>;
        cpu?: Array<{ tengoi: string; url: string }>;
        mainboard?: Array<{ tengoi: string; url: string }>;
        dungluongram?: Array<{ tengoi: string; url: string }>;
        ram?: Array<{ tengoi: string; url: string }>;
        ocung?: Array<{ tengoi: string; url: string }>;
        carddohoa?: Array<{ tengoi: string; url: string }>;
        kichcomanhinh?: Array<{ tengoi: string; url: string }>;
        bonhotrong?: Array<{ tengoi: string; url: string }>;
        chipxuli?: Array<{ tengoi: string; url: string }>;
        kichcomanhinhtivi?: Array<{ tengoi: string; url: string }>;
        hangsanxuat?: Array<{ tengoi: string; url: string }>;
        congsuat?: Array<{ tengoi: string; url: string }>;
    };
    brokenImages: Set<string>;
    onImageError: (imageUrl: string) => void;
    onCartUpdate?: () => void; // Optional callback để refresh cart
    onWishlistUpdate?: () => void; // Optional callback để refresh wishlist
}

export default function ProductCard({ product, brokenImages, onImageError, onCartUpdate, onWishlistUpdate }: ProductCardProps) {
    // Lấy thông tin kỹ thuật quan trọng
    const getBrand = () => {
        return product.thuonghieu?.[0]?.tengoi ||
            product.hangsanxuat?.[0]?.tengoi || '';
    };

    const getSpecs = () => {
        const specs = [];

        // CPU
        if (product.cpu?.[0]?.tengoi) {
            specs.push({ icon: faMicrochip, label: 'CPU', value: product.cpu[0].tengoi, color: 'text-success' });
        } else if (product.chipxuli?.[0]?.tengoi) {
            specs.push({ icon: faBolt, label: 'Chip', value: product.chipxuli[0].tengoi, color: '#007bff' });
        }

        // Mainboard
        if (product.mainboard?.[0]?.tengoi) {
            specs.push({ icon: faWrench, label: 'Mainboard', value: product.mainboard[0].tengoi, color: 'text-primary' });
        }

        // RAM
        const ramValue = product.dungluongram?.[0]?.tengoi || product.ram?.[0]?.tengoi;
        if (ramValue) {
            specs.push({ icon: faFloppyDisk, label: 'Dung lượng RAM', value: ramValue, color: 'text-info' });
        }

        // Storage
        if (product.ocung?.[0]?.tengoi) {
            specs.push({ icon: faCompactDisc, label: 'Ổ cứng', value: product.ocung[0].tengoi, color: 'text-success' });
        } else if (product.bonhotrong?.[0]?.tengoi) {
            specs.push({ icon: faCompactDisc, label: 'Bộ nhớ trong', value: product.bonhotrong[0].tengoi, color: '#fd7e14' });
        }

        // Graphics
        if (product.carddohoa?.[0]?.tengoi) {
            specs.push({ icon: faImage, label: 'Card đồ họa', value: product.carddohoa[0].tengoi, color: 'text-primary' });
        }

        // Screen size
        const screenSize = product.kichcomanhinh?.[0]?.tengoi ||
            product.kichcomanhinhtivi?.[0]?.tengoi;
        if (screenSize) {
            specs.push({ icon: faDesktop, label: 'Kích cỡ màn hình', value: screenSize, color: 'text-success' });
        }

        // Power for AC
        if (product.congsuat?.[0]?.tengoi) {
            specs.push({ icon: faBolt, label: 'Công suất', value: product.congsuat[0].tengoi, color: '#ffc107' });
        }

        return specs.slice(0, 4); // Lấy tối đa 4 specs quan trọng nhất
    };

    const specs = getSpecs();
    const brand = getBrand();

    const [addingToCart, setAddingToCart] = useState(false);
    const [addingToWishlist, setAddingToWishlist] = useState(false);
    const { showToast } = useToastContext();

    // Hàm xử lý thêm giỏ hàng
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setAddingToCart(true);
        try {
            console.log("🛒 [ProductCard] Adding to cart:", product.id);
            const result = await addToCartGuest(product.id);
            console.log("🛒 [ProductCard] Cart result:", result);

            // Hiển thị toast thông báo
            showToast('cart', 'Đã thêm vào giỏ hàng', product.tieude);

            // Dispatch custom event để các components khác có thể lắng nghe
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: {
                    productId: product.id,
                    action: 'add',
                    productName: product.tieude
                }
            }));

            // Gọi callback để refresh cart nếu có
            if (onCartUpdate) {
                onCartUpdate();
            }

        } catch (error) {
            console.error("❌ [ProductCard] Error adding to cart:", error);
            showToast('cart', 'Có lỗi xảy ra khi thêm vào giỏ hàng');
        } finally {
            setAddingToCart(false);
        }
    };

    // Handle add to wishlist - Dùng chung cho cả guest và user đã đăng nhập
    const handleAddToWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("❤️ [ProductCard] STARTING handleAddToWishlist for product:", product.id, product.tieude);
        setAddingToWishlist(true);
        try {
            console.log("❤️ [ProductCard] About to call addToWishlistGuest...");
            const result = await addToWishlistGuest(product.id);
            console.log("❤️ [ProductCard] addToWishlistGuest result:", result);

            // Hiển thị toast thông báo
            console.log("❤️ [ProductCard] Showing toast notification...");
            showToast('wishlist', 'Đã thêm vào danh sách yêu thích', product.tieude);

            // Dispatch custom event để các components khác có thể lắng nghe
            console.log("❤️ [ProductCard] Dispatching wishlistUpdated event...");
            window.dispatchEvent(new CustomEvent('wishlistUpdated', {
                detail: {
                    productId: product.id,
                    action: 'add',
                    productName: product.tieude
                }
            }));
            console.log("❤️ [ProductCard] Event dispatched successfully");

            // Gọi callback để refresh wishlist nếu có
            if (onWishlistUpdate) {
                console.log("❤️ [ProductCard] Calling onWishlistUpdate callback...");
                onWishlistUpdate();
            }

        } catch (error) {
            console.error("❌ [ProductCard] Error adding to wishlist:", error);
            showToast('wishlist', 'Có lỗi xảy ra khi thêm vào danh sách yêu thích');
        } finally {
            console.log("❤️ [ProductCard] handleAddToWishlist finished, setting loading to false");
            setAddingToWishlist(false);
        }
    };


    return (
        <div className="modern-product-card shadow-sm mt-3 rounded border">
            <Link
                href={`san-pham/${product.url}-${product.id}`}
                className="text-decoration-none h-100 d-block"
            >
                <div className="card modern-card h-100 border-0 position-relative overflow-hidden">
                    {/* Sale badge */}
                    {product.giakhuyenmai && product.giakhuyenmai !== "0" && (
                        <div className="sale-badge">
                            <span className="badge bg-danger">
                                -{product.giakhuyenmai}%
                            </span>
                        </div>
                    )}

                    <div className="card-header p-3">
                        {/* Product Title */}
                        <div className="product-title-section">
                            <h6 className="product-title text-primary fw-bold">
                                {product.tieude}
                            </h6>
                        </div>
                    </div>

                    <div className="card-body p-0 d-flex flex-column h-100 p-3">
                        {/* Product Image */}
                        <div className="product-image-section">
                            {product.hinhdaidien && !brokenImages.has(product.hinhdaidien) ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={product.hinhdaidien}
                                    alt={product.tieude}
                                    width="100%"
                                    height={200}
                                    className="product-image object-fit-contain"
                                    onError={() => onImageError(product.hinhdaidien)}

                                />
                            ) : (
                                <div className="image-placeholder">
                                    <i className="fas fa-image text-muted"></i>
                                    <span className="text-muted small">Không có hình</span>
                                </div>
                            )}
                        </div>

                        {/* Specifications */}
                        <div className="specs-section">
                            {/* Brand */}
                            {brand && (
                                <div className="spec-item">
                                    <span className="text-info font-bold">
                                        <FontAwesomeIcon icon={faTag} />
                                        <span> Thương hiệu: </span>
                                    </span>
                                    <span className="text-primary">{brand}</span>
                                </div>
                            )}

                            {specs.map((spec, index) => (
                                <div key={index} className="spec-item">
                                    <p>
                                        <span className={`${spec.color}`}>
                                            <FontAwesomeIcon icon={spec.icon} className="fw-bold" />
                                            <span className="fw-bold"> {spec.label}: </span>
                                        </span>
                                        <span className="text-primary">{spec.value}</span>
                                    </p>
                                </div>
                            ))}

                            {/* Brand */}
                            {product.gia && (
                                <div className="spec-item">
                                    <span>Giá bán: </span>
                                    <span>{product.gia}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons d-flex mt-3">
                            <button
                                className="btn btn-primary me-2 flex-grow-1"
                                onClick={handleAddToCart}
                                disabled={addingToCart}>
                                <FontAwesomeIcon icon={faShoppingCart} />
                                <span> Mua hàng</span>
                            </button>
                            <button
                                className="btn btn-success flex-grow-1"
                                onClick={handleAddToWishlist}
                                disabled={addingToWishlist}>
                                <FontAwesomeIcon icon={faHeart} />
                                <span> Wishlist</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Link >
        </div >
    );
}