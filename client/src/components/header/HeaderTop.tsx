"use client";

import { getContentHeader } from "@/redux/api/reduxContentApi";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GuestCart from "../cart/GuestCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { useGuestCart } from "@/hooks/useGuestCart";
import GuestWishlist from "../cart/GuestWishlist";
import { useGuestWishlist } from "@/hooks/useGuestWishlist";

export default function HeaderTop() {
  // const { headerMenu } = useSelector((state: RootState) => state.contents);
  // const dispatch = useDispatch<AppDispatch>();
  // useEffect(() => {
  //   dispatch(getContentHeader());
  // }, [dispatch]);

  // =============================== Cart & Wishlist ===============================
  const { getTotalItems, refreshCart } = useGuestCart();
  const countCartItems = getTotalItems();

  const { getTotalItems: getWishlistTotalItems, refreshWishlist } = useGuestWishlist();
  const wishlistCount = getWishlistTotalItems();

  useEffect(() => {
    const handleCartUpdate = () => {
      console.log("🔥 [HeaderTop] Received cartUpdated event, refreshing cart...");
      refreshCart();
    };

    const handleWishlistUpdate = () => {
      console.log("❤️ [HeaderTop] Received wishlistUpdated event, refreshing wishlist...");
      refreshWishlist();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [refreshCart, refreshWishlist]);


  // return (
  //   <div className="d-lg-block d-none">
  //     <nav className="navbar navbar-expand-lg navbar-dark px-3 py-2 bg-primary"
  //       style={{ zIndex: 2 }}>
  //       <ul className="navbar-nav flex-column flex-lg-row gap-3 gap-lg-4 w-100 mb-0 flex-wrap">
  //         {/* dekstop menu */}
  //         {headerMenu?.map((nav) => (
  //           <li
  //             key={nav.idpart}
  //             className={`nav-item dropdown-center d-none d-lg-block ${nav.menucap1 ? "position-relative" : ""
  //               }`}
  //           >
  //             <Link
  //               href={`${nav.url}`}
  //               className={`nav-link text-white text-wrap fw-semibold ${nav.menucap1 ? "dropdown-toggle" : ""
  //                 }`}
  //             >
  //               {nav.tieude}
  //             </Link>
  //             {nav.menucap1 && (
  //               <ul className="dropdown-menu">
  //                 {nav.menucap1.map((item) => (
  //                   <li key={item.idpart}>
  //                     <Link className="dropdown-item" href={`${item.url}`}>
  //                       {item.tieude}
  //                     </Link>
  //                   </li>
  //                 ))}
  //               </ul>
  //             )}
  //           </li>
  //         ))}
  //       </ul>
  //     </nav>
  //   </div>
  // );


  return (
    <>
      <div className="header-menu bg-primary ">
        <div className="top-bar top-menu top-menu-master ">
          <ul className="navbar d-flex justify-content-start w-100 gap-2">
            <li className="nav-item nav-mn nhomparent35008 ">
              <a
                href="/thu-vien-anh"
                data-cat="p"
                data-id={35008}
                id="nav35008"
                className="nav-link nav-pr navlink-p text-white"
              >
                Thư viện ảnh
              </a>
            </li>
            {/* <li className="nav-item nhomparent35130 menudautrangkieuLayGioHang">
                      <span className="giohangcoban" style={{ cursor: "pointer" }} />
                    </li> */}
            <li className="nav-item nav-mn nhomparent35278 ">
              <a
                href="/mua-ban-dien-thoai-di-dong"
                data-cat="p"
                data-id={35278}
                id="nav35278"
                className="nav-link nav-pr navlink-p"
              >
                Điện thoại di động
              </a>
            </li>
            <li className=" nav-item nhomparent35132 menudautrangkieuQuangcao">
              <div className="noidungquangcao">
                <p>
                  Máy tính Chồi Xanh <a href="http://tel:0907240247">0907240247</a>
                </p>
              </div>
            </li>
            <li className="nav-item nav-mn nhomparent35139 dropdown ">
              <a
                href="/tin-cong-nghe"
                data-cat="p"
                data-id={35139}
                id="nav35139"
                className="nav-link nav-pr navlink-p dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Công nghệ
              </a>
              <ul className="dropdown-menu cap1" aria-labelledby="nav35139">
                <li className="nhomcat35151 ">
                  <a
                    className="dropdown-item navlink-c"
                    href="/tin-tuc-tri-tue-nhan-tao-AI"
                    data-cat="p"
                    data-id={35151}
                  >
                    AI
                  </a>
                </li>
                <li className="nhomcat35152 ">
                  <a
                    className="dropdown-item navlink-c"
                    href="/chuyen-doi-so"
                    data-cat="p"
                    data-id={35152}
                  >
                    Chuyển đổi số
                  </a>
                </li>
                <li className="nhomcat35153 ">
                  <a
                    className="dropdown-item navlink-c"
                    href="/nhip-song-so"
                    data-cat="p"
                    data-id={35153}
                  >
                    Nhịp sống số
                  </a>
                </li>
                <li className="nhomcat35154 ">
                  <a
                    className="dropdown-item navlink-c"
                    href="/thiet-bi"
                    data-cat="p"
                    data-id={35154}
                  >
                    Thiết bị
                  </a>
                </li>
                <li className="nhomcat35155 ">
                  <a
                    className="dropdown-item navlink-c"
                    href="/trai-nghiem"
                    data-cat="p"
                    data-id={35155}
                  >
                    Trải nghiệm
                  </a>
                </li>
              </ul>
            </li>
            {/* giỏ hàng & yêu thích */}
            <li className="ms-auto text-primary bg-white me-3 rounded">
              <button className="cursor-pointer text-primary"
                data-bs-toggle="modal" data-bs-target="#cartModal"
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '8px 10px',
                  position: 'relative'
                }}>
                <FontAwesomeIcon icon={faShoppingBag} />
                Giỏ hàng

                <span className="ms-1">
                  {countCartItems}
                </span>
              </button>
              |
              <button className="cursor-pointer text-primary"
                data-bs-toggle="modal" data-bs-target="#wishlistModal"
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '8px 10px'
                }}>

                <FontAwesomeIcon icon={faHeart} />
                Yêu thích
                <span className="ms-1">{wishlistCount}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Cart modal */}
      <div
        className="modal fade"
        id="cartModal"
        tabIndex={-1}
        aria-labelledby="cartModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="cartModalLabel">
                Giỏ hàng
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <GuestCart />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist modal */}
      <div
        className="modal fade"
        id="wishlistModal"
        tabIndex={-1}
        aria-labelledby="wishlistModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="wishlistModalLabel">
                Wishlist
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <GuestWishlist />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
