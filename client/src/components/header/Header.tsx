"use client";

import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faCartArrowDown,
  faSearch,
  faBars,
  faTimes,
  faUser,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { headerTopMenuListLeft, headerTopMenuListRight } from "@/api/ListApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleLogout } from "@/api/authApi";
import { useRouter } from "next/navigation";
import { logout as logoutAction, loadUserFromStorage } from "@/redux/slices/auth.slice";
import GuestCart from "../cart/GuestCart";
import { useGuestCart } from "@/hooks/useGuestCart";

export default function Header() {
  // Lấy trạng thái `loggedIn` và `users` từ Redux store (slice `auths`)
  const { loggedIn, users } = useSelector((state: RootState) => state.auths);

  // Lấy dispatch kiểu đã được type (AppDispatch) để dispatch action tới store
  const dispatch = useDispatch<AppDispatch>();

  // Load user từ localStorage nếu chưa có trong state
  useEffect(() => {
    // Nếu chưa có trạng thái đăng nhập trong Redux và đang chạy trên trình duyệt
    if (!loggedIn && typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userInfo = localStorage.getItem('userInfo');
      // console.log('🔍 [Header] Checking localStorage:', { isLoggedIn, userInfo }); // (Dòng debug, có thể mở để kiểm tra)

      if (isLoggedIn === 'true' && userInfo) {
        // Gọi action để load dữ liệu user từ localStorage vào store
        dispatch(loadUserFromStorage());
      }
    }
  }, [loggedIn, dispatch]);

  const { navbar, headerContent } = useSelector(
    (state: RootState) => state.contents
  );
  const [search, setSearch] = useState<string>();

  const [navOpen, setNavOpen] = useState(false);
  const [openMenuChild, setOpenMenuChild] = useState<boolean>(false);

  const router = useRouter();

  // ====================== Logout ======================
  const logout = async () => {
    try {
      await handleLogout();
      dispatch(logoutAction());
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn logout local state ngay cả khi API lỗi
      dispatch(logoutAction());
      router.push('/');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?keyword=${search}`);
  };


  // =============================== Cart ===============================
  const { getTotalItems, refreshCart } = useGuestCart();
  const countCartItems = getTotalItems();

  useEffect(() => {
    const handleCartUpdate = () => {
      console.log("🔥 [Header] Received cartUpdated event, refreshing cart...");
      refreshCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [refreshCart]);

  // return (
  //   <div className="px-3 py-2 text-white shadow-sm bg-success sticky-top">
  //     {/* ===== Top Bar ===== */}
  //     <div className="d-flex justify-content-between align-items-center small">

  //       {/* Right menu */}
  //       <ul className="flex-wrap gap-2 mb-0 d-flex gap-md-3 list-unstyled">
  //         {loggedIn && (
  //           <li className="dropdown-center">
  //             <Link
  //               className="gap-1 text-white text-decoration-none d-flex align-items-center hover-opacity"
  //               href={"/users"}
  //             >
  //               <FontAwesomeIcon icon={faUser} />
  //               {users?.name}
  //             </Link>
  //           </li>
  //         )}

  //         {/* Nếu đã đăng nhập thì ẩn mục tài khoản */}
  //         {!loggedIn && (
  //           headerTopMenuListRight.map((menu) => (
  //             <li className="dropdown-center" key={menu.id}>
  //               <Link
  //                 href={menu.url}
  //                 onClick={() =>
  //                   menu.menuchild ? setOpenMenuChild(!openMenuChild) : () => null
  //                 }
  //                 className={`text-white nav-link${menu.menuchild ? " dropdown-toggle" : ""
  //                   }`}
  //               >
  //                 <FontAwesomeIcon icon={menu.icon} /> {menu.name}
  //               </Link>
  //               {openMenuChild && menu.menuchild && (
  //                 <ul className="gap-2 p-2 bg-white rounded list-unstyled ms-4 position-absolute d-flex text-dark flex-column">
  //                   {menu.menuchild.map((child) => (
  //                     <li key={child.id}>
  //                       <Link className="dropdown-item" href={child.url}>
  //                         {child.name}
  //                       </Link>
  //                     </li>
  //                   ))}
  //                 </ul>
  //               )}
  //             </li>
  //           ))
  //         )}

  //         {/* Logout button */}
  //         {loggedIn && (
  //           <li>
  //             <button
  //               className="text-white bg-transparent border-0"
  //               onClick={logout}
  //             >
  //               Đăng xuất
  //             </button>
  //           </li>
  //         )}
  //       </ul>
  //     </div>

  //     {/* ===== Middle Bar ===== */}
  //     <div className="flex-wrap gap-3 py-3 d-flex align-items-center justify-content-between">
  //       {/* Logo */}
  //       <Link href="/" className="px-2">
  //         {headerContent && (
  //           <Image
  //             src={`https://choixanh.net/mediaroot/media/userfiles/useruploads/6/image/he-thong/logo-10.png`}
  //             alt="logo"
  //             title="choixanhmedia.com.vn"
  //             width={126}
  //             height={10}
  //             style={{ inlineSize: "126px", blockSize: "10px" }}
  //             className="object-fit-cover"
  //           />
  //         )}
  //       </Link>

  //       {/* Search Form */}
  //       <form
  //         onSubmit={handleSearch}
  //         className="gap-1 mx-2 d-flex flex-grow-1"
  //         style={{ maxInlineSize: "600px", minInlineSize: "200px" }}
  //       >
  //         <input
  //           type="text"
  //           onChange={(e) => setSearch(e.target.value)}
  //           className="px-3 bg-white form-control text-dark rounded-start"
  //           placeholder="Tìm kiếm sản phẩm..."
  //         />
  //         <button className="border btn btn-light rounded-end">
  //           <FontAwesomeIcon icon={faSearch} />
  //         </button>
  //       </form>

  //       {/* Mobile Toggle Button */}
  //       <div className="d-lg-none d-block">
  //         <button
  //           className="btn btn-light"
  //           onClick={() => setNavOpen(!navOpen)}
  //         >
  //           <FontAwesomeIcon icon={navOpen ? faTimes : faBars} />
  //         </button>
  //       </div>

  //       {/* Desktop Action Icons */}
  //       <div className="gap-2 d-lg-flex d-none">
  //         <button
  //           className="rounded btn btn-outline-light"
  //           data-bs-toggle="modal" data-bs-target="#exampleModal"
  //           style={{
  //             position: 'relative'
  //           }}>
  //           <span
  //             style={{
  //               position: 'absolute',
  //               right: '-7px',
  //               top: '-14px',
  //               background: '#f00',
  //               color: '#fff',
  //               width: '24px',
  //               height: '24px',
  //               borderRadius: '50%',
  //               display: 'flex',
  //               alignItems: 'center',
  //               justifyContent: 'center'
  //             }}
  //           >
  //             {countCartItems}
  //           </span>
  //           <FontAwesomeIcon icon={faShoppingBag} />
  //         </button>
  //         <Link
  //           href={"/wishlist"}
  //           className="rounded btn btn-outline-light"
  //         >
  //           <FontAwesomeIcon icon={faHeart} />
  //         </Link>
  //       </div>
  //     </div>

  //     {/* ===== Navbar ===== */}
  //     <nav
  //       className={`navbar navbar-expand-lg navbar-dark rounded px-3 py-2 ${navOpen ? "" : "d-none d-lg-block"
  //         }`}
  //     >
  //       <ul className="flex-wrap gap-3 mb-0 navbar-nav flex-column flex-lg-row gap-lg-4 w-100 justify-content-center">
  //         {/* Desktop menu */}
  //         {navbar?.map((nav) => (
  //           <li
  //             key={nav.id}
  //             className={`nav-item dropdown-center d-none d-lg-block ${nav.children ? "position-relative" : ""
  //               }`}
  //           >
  //             <Link
  //               href={`/${nav.tieude === "Trang chủ"
  //                 ? "/"
  //                 : `${nav.kieuhienthi.toLowerCase()}/${nav.id}`
  //                 }`}
  //               className={`nav-link text-white fw-semibold text-wrap ${nav.children ? "dropdown-toggle" : ""
  //                 }`}
  //               onClick={() => setNavOpen(false)}
  //             >
  //               {nav.tieude}
  //             </Link>
  //             {nav.children && (
  //               <ul className="dropdown-menu">
  //                 {nav.children.map((item) => (
  //                   <li key={item.id}>
  //                     <Link
  //                       className="dropdown-item text-wrap"
  //                       href={`/${nav.kieuhienthi.toLowerCase()}/${item.id}`}
  //                       onClick={() => setNavOpen(false)}
  //                     >
  //                       {item.tieude}
  //                     </Link>
  //                   </li>
  //                 ))}
  //               </ul>
  //             )}
  //           </li>
  //         ))}
  //         {/* Divider for mobile */}
  //         <span className="d-block d-lg-none">
  //           <hr />
  //         </span>
  //         {/* Mobile navbar from navbar */}
  //         {navbar?.map((nav) => (
  //           <li key={nav.id} className="dropend d-lg-none position-relative">
  //             <Link
  //               href={`/${nav.tieude === "Trang chủ"
  //                 ? "/"
  //                 : `${nav.kieuhienthi.toLowerCase()}/${nav.id}`
  //                 }`}
  //               className={`nav-link text-white fw-semibold text-wrap ${nav.children ? "dropdown-toggle" : ""
  //                 }`}
  //               onClick={() => setNavOpen(false)}
  //             >
  //               {nav.tieude}
  //             </Link>
  //             {nav.children && (
  //               <ul className="dropdown-menu position-absolute">
  //                 {nav.children.map((item) => (
  //                   <li key={item.id}>
  //                     <Link
  //                       className="dropdown-item text-wrap"
  //                       href={`/${nav.kieuhienthi.toLocaleLowerCase()}/${item.id
  //                         }`}
  //                       onClick={() => setNavOpen(false)}
  //                     >
  //                       {item.tieude}
  //                     </Link>
  //                   </li>
  //                 ))}
  //               </ul>
  //             )}
  //           </li>
  //         ))}

  //         {/* Mobile Action Buttons */}
  //         <li className="gap-2 d-flex d-lg-none">
  //           <Link
  //             href={loggedIn ? "/gio-hang" : "/login"}
  //             className="text-white border rounded btn"
  //           >
  //             <FontAwesomeIcon icon={faCartArrowDown} />
  //           </Link>
  //           <Link
  //             href={loggedIn ? "/wishlist" : "/login"}
  //             className="text-white border rounded btn"
  //           >
  //             <FontAwesomeIcon icon={faHeart} />
  //           </Link>
  //           <Link
  //             href={loggedIn ? "/order-history" : "/login"}
  //             className="text-white border rounded btn"
  //           >
  //             <FontAwesomeIcon icon={faShoppingBag} />
  //           </Link>
  //         </li>{" "}
  //       </ul>
  //     </nav>

  //     {/* Cart modal */}
  //     <div
  //       className="modal fade"
  //       id="exampleModal"
  //       tabIndex={-1}
  //       data-bs-backdrop="false"
  //       aria-labelledby="exampleModalLabel"
  //       aria-hidden="true">
  //       <div className="modal-dialog modal-lg">
  //         <div className="modal-content">
  //           <div className="modal-header">
  //             <h1 className="modal-title fs-5" id="exampleModalLabel">
  //               Giỏ hàng
  //             </h1>
  //             <button
  //               type="button"
  //               className="btn-close"
  //               data-bs-dismiss="modal"
  //               aria-label="Close"
  //             />
  //           </div>
  //           <div className="modal-body">
  //             <GuestCart />
  //           </div>
  //           <div className="modal-footer">
  //             <button
  //               type="button"
  //               className="btn btn-danger"
  //               data-bs-dismiss="modal"
  //             >
  //               Close
  //             </button>
  //             <button type="button" className="btn btn-primary">
  //               Save changes
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className={`container-fluid p-0 bg-success py-2 sticky-top`}>
      {/* Navbar below banner */}
      <nav className={`navbar-expand-lg container-lg navbar navbar-dark d-flex`}>
        <div>
          <div className="wrap-main-menu">
            <div className="navbar-header">
              {" "}
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                {" "}
                <span className="navbar-toggler-icon" />{" "}
              </button>{" "}
            </div>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav me-auto ">
                <li className="nav-item nav-mn nhomparent35001 ">
                  <a
                    href="/"
                    data-cat="h"
                    data-id={35001}
                    id="nav35001"
                    className="nav-link nav-pr navlink-p"
                  >
                    <span className="imgparent none">
                      <i className="fa fa-home" />
                    </span>
                    Trang chủ
                  </a>
                </li>
                <li className="nav-item nav-mn nhomparent99999 ">
                  <a
                    href="/"
                    data-cat="h"
                    data-id={99999}
                    id="nav99999"
                    className="nav-link nav-pr navlink-p"
                  >
                    <span className="imgparent none">
                      <i className="fa fa-home" />
                    </span>
                    Trang chủ
                  </a>
                </li>
                <li className="nav-item nav-mn nhomparent35008 ">
                  <a
                    href="/thu-vien-anh"
                    data-cat="p"
                    data-id={35008}
                    id="nav35008"
                    className="nav-link nav-pr navlink-p"
                  >
                    Thư viện ảnh
                  </a>
                </li>
                <li className="nav-item nav-mn nhomparent35131 ">
                  <a
                    href="/san-xuat-qua-tang-quang-cao"
                    data-cat="p"
                    data-id={35131}
                    id="nav35131"
                    className="nav-link nav-pr navlink-p"
                  >
                    Sản xuất quà tặng quảng cáo
                  </a>
                </li>
                <li className="nav-item nav-mn nhomparent35279 ">
                  <a
                    href="/mua-ban-may-tinh"
                    data-cat="p"
                    data-id={35279}
                    id="nav35279"
                    className="nav-link nav-pr navlink-p"
                  >
                    Máy vi tính
                  </a>
                </li>
                <li className="nav-item nav-mn nhomparent35280 ">
                  <a
                    href="/tivi"
                    data-cat="p"
                    data-id={35280}
                    id="nav35280"
                    className="nav-link nav-pr navlink-p"
                  >
                    Tivi
                  </a>
                </li>
                <li className="nav-item nav-mn nhomparent35283 ">
                  <a
                    href="/may-lanh"
                    data-cat="p"
                    data-id={35283}
                    id="nav35283"
                    className="nav-link nav-pr navlink-p"
                  >
                    Máy lạnh
                  </a>
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
                <li className="nav-item nav-mn nhomparent35028 ">
                  <a
                    href="/lien-he"
                    data-cat="p"
                    data-id={35028}
                    id="nav35028"
                    className="nav-link nav-pr navlink-p"
                  >
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>
            {/* <div className="d-flex d-lg-none mobileVersiononly"></div> */}
          </div>
        </div>

        {/* Search box */}
        <div className=" nav-item nhomparent35120 menudautrangkieuLayTimKiem mx-auto">
          <div className="boxsearch timkiemthongtin me-auto" id="formsearweb" />
          <span id="autosuggest" style={{ display: "none" }} />
        </div>

        {/* <div className=" nav-item nhomparent35038 btndangnhap LayThanhVien"
              style={{ visibility: 'hidden' }}>
              Thành viên
            </div> */}


        <div>
          {/* Nếu đăng nhập thì chào mừng, chưa đăng nhập hiện nút đăng nhập */}
          {loggedIn ?

            <div className="position-relative show-dropdown">
              <button
                className="btn btn-primary border  fw-bold">
                Chào mừng, {users?.email}
              </button>

              <div className="bg-white rounded dropdown-item-login border position-absolute end-0 " style={{ maxWidth: '200px' }}>
                <Link href="#" className="d-block text-black border-bottom py-2 px-4 rounded" onClick={logout}>Đăng thoát</Link>
              </div>
            </div >
            :
            <Link href={'/login'} className="btn btn-primary border fw-bold">
              Đăng nhập
            </Link>
          }
        </div >
      </nav >

      <style jsx>{`
        .dropdown-item-login{
        display: none;
        }

        .dropdown-btn-login::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        right: 0;
        height: 20px;
        background: red;
        z - index: 20;
      }

      .show-dropdown:hover > .dropdown-item-login {
        display: block;
      }
  `}
      </style>
    </div >
  )
}
