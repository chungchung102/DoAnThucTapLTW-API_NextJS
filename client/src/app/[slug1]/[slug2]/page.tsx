// import RenderPageContent from "./RenderPageContent";
// import axios from "axios";
// import { Metadata } from "next";
// import BannerPage from "./BannerPage";

// type PageParams = {
//   params: {
//     slug1: string;
//     slug2: string;
//   };
// };

// // Server-side metadata
// export async function generateMetadata({
//   params,
// }: PageParams): Promise<Metadata> {
//   const { slug1, slug2 } = await params;
//   const id = slug2;
//   const pagemodule = slug1 === "lienhe" ? "tintuc" : "tintuc";

//   const response = await axios.get(
//     `http://127.0.0.1:8000/api/module.${pagemodule}.php?id=${id}`
//   );

//   const data = Array.isArray(response.data) ? response.data[0] : response.data;

//   return {
//     title: `Chồi Xanh | ${data?.tieude}`,
//     description: data?.metadescription ?? "",
//     keywords: data?.metakeywords ?? "",
//   };
// }

// export default async function Page({ params }: PageParams) {
//   const { slug1, slug2 } = await params;
//   return (
//     <>
//       <BannerPage />
//       <RenderPageContent module={slug1} id={slug2} />
//     </>
//   );
// }


'use client';

import { addToCartGuest, addToWishlistGuest } from "@/api/contentApi";
import FilterBox from "@/components/filter/FilterDetail";
import LeftContent from "@/components/pagebody/LeftContent";
import ProductContainer from "@/components/products/ProductContainer";
import { useToastContext } from "@/components/ui/ToastProvider";
import { faFacebookF, faLinkedinIn, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { faCartArrowDown, faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


interface ProductDetail {
  id: string;
  ngaydang: string;
  luotxem: string;
  diemdanhgia: string;
  soluong: string;
  chophepbinhluan: string;
  hienthibinhluan: string;
  url: string;
  tieude: string;
  noidungchitiet: string;
  hinhdaidien: string;
  ma: string;
  gia: string;
  giakhuyenmai: string;
  giasi: string;
  noidungtomtat: string;
}

interface RelatedProduct {
  id: string;
  ngaydang: string;
  hinhdaidien: string;
  tieude: string;
  url: string;
  masp: string;
  trongluong: string;
  gia: string;
  giakhuyenmai: string;
  thuonghieu?: Array<{ tengoi: string; url: string }>;
  kichcomanhinh?: Array<{ tengoi: string; url: string }>;
  tinhnangdacbiet?: Array<{ tengoi: string; url: string }>;
  hieunangvapin?: Array<{ tengoi: string; url: string }>;
  camera?: Array<{ tengoi: string; url: string }>;
  bonhotrong?: Array<{ tengoi: string; url: string }>;
  dungluongram?: Array<{ tengoi: string; url: string }>;
  tansoquet?: Array<{ tengoi: string; url: string }>;
  chipxuli?: Array<{ tengoi: string; url: string }>;
}

interface RelatedApiResponse {
  tieude: string;
  xemthem: string;
  tenham: string;
  url: string;
  baiviet: RelatedProduct[];
}

export default function childrenPage() {
  const { slug2 } = useParams(); // Lấy slug2 từ URL
  // console.log('slug2 =>', slug2); // Example output: "example-slug-123"
  // Lấy id từ slug2
  const id = slug2?.toString().split('-').reverse()[0];

  const [currentImageIndex, setCurrentImageIndex] = useState(0); // state quản lý index các hình ảnh chi tiết


  const [productData, setProductData] = useState<ProductDetail[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<RelatedApiResponse[]>([]); // Sản phẩm liên quan

  // Định nghĩa kiểu dữ liệu cho dữ liệu lấy về
  type ProductData = {
    id: string;
    tieude?: string;
    [key: string]: any;
  };

  type ImagesData = {
    hinhdaidien?: string;
    [key: string]: any;
  };

  // ---- Interface (định nghĩa kiểu dữ liệu) ---- //
  interface OptionItem {
    tengoi: string; // Tên hiển thị (ví dụ: Acer, Apple...)
    ma: string;     // Mã của option
    url: string;    // Đường dẫn liên kết (nếu cần)
  }

  const [data, setData] = useState<ProductData | null>(null); // State để lưu dữ liệu lấy về
  // const [data, setData] = useState<ProductDetail[]>([]); // State để lưu dữ liệu lấy về
  const [images, setImages] = useState<ImagesData | null>(null); // State để lưu các hình ảnh chi tiết của sản phẩm 
  const [isLoading, setIsLoading] = useState(true); // State để quản lý trạng thái tải

  useEffect(() => {
    // Fetch dữ liệu khi component được mount hoặc khi id thay đổi
    const fetchData = async () => {
      try {
        const res = await fetch(`https://demodienmay.125.atoz.vn/ww2/module.sanpham.chitiet.asp?id=${id}`);
        const data = await res.json();
        setData(data[0] || null);

        setIsLoading(false);
      }
      catch (error) {
        console.error("Lỗi không thể fetching:", error);
      }
    }

    // Fetch hình ảnh khi component được mount hoặc khi id thay đổi
    const fetchImages = async () => {
      try {
        const res = await fetch(`https://demodienmay.125.atoz.vn/ww2/tinhnang.hinhanh.idpart.asp?id=${id}`);
        const data = await res.json();
        setImages(data?.[0].data || null);
      }
      catch (error) {
        console.error("Lỗi không thể fetching:", error);
      }
    }

    fetchData();
    fetchImages();
  }, [id]);


  // Quản lý Socials
  const socials = [
    { name: 'Theo dõi', icon: faHeart, colorBtn: 'btn-primary', url: '', className: 'addtowishlist' },
    { name: 'Facebook', icon: faFacebookF, colorBtn: 'btn-primary', url: '' },
    { name: 'Twitter', icon: faTwitter, colorBtn: 'btn-info', url: '' },
    { name: 'LinkedIn', icon: faLinkedinIn, colorBtn: 'btn-success', url: '' },
  ]

  const { showToast } = useToastContext();
  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingToCart(true);
    try {
      const result = await addToCartGuest(id);

      // Hiển thị toast thông báo
      showToast('cart', 'Đã thêm vào giỏ hàng', data?.tieude);

      // Dispatch custom event để các components khác có thể lắng nghe
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: {
          productId: id,
          action: 'add',
          productName: data?.tieude
        }
      }));


      // Gọi callback để refresh cart nếu có
      // if (onCartUpdate) {
      //   onCartUpdate();
      // }

      // console.log("Added to cart:", result);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast('cart', 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
    }
  };


  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingToWishlist(true);
    try {
      const result = await addToWishlistGuest(id);

      // Hiển thị toast thông báo
      showToast('wishlist', 'Đã thêm vào danh sách yêu thích', data?.tieude);

      window.dispatchEvent(new CustomEvent('wishlistUpdated', {
        detail: {
          productId: id,
          action: 'add',
          productName: data?.tieude
        }
      }));

      // Gọi callback để refresh wishlist nếu có
      // if (onWishlistUpdate) {
      //   onWishlistUpdate();
      // }

      // Dispatch event để header có thể cập nhật
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));

      console.log("Added to wishlist:", result);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      showToast('wishlist', 'Có lỗi xảy ra khi thêm vào danh sách yêu thích');
    } finally {
      setAddingToWishlist(false);
    }
  };


  // Hiển thị trạng thái tải
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <main className="container-lg">
      <nav aria-label="breadcrumb" className="my-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Trang chủ</Link>
          </li>
          <li className="breadcrumb-item active">Chi tiết sản phẩm</li>
        </ol>
      </nav>

      <div className="row mt-5">
        <div className="col-lg-3">
          {/* Left menu */}
          <LeftContent />
          {/* Bộ lọc chi tiết */}
          <FilterBox />
        </div>

        <div className="col-lg-9 ">
          <div className="row">
            {/* Tên sản phẩm */}
            <h1>{data?.tieude}</h1>

            {/* Social btns */}
            <div className="d-flex align-items-center flex-grow-1 mt-1 mb-2">
              <div
                id="socialShare"
                className="ms-auto d-flex align-items-end justify-content-end social-share mb-2">
                {socials.map((social, index) =>
                  social.className ?
                    <a key={index}
                      href="#"
                      className={`btn ${social.colorBtn} d-flex align-items-center me-2 btn-sm addtowishlist`}
                    >
                      <FontAwesomeIcon icon={social.icon} />
                      <span className='d-none d-md-inline ms-1'>{social.name}</span>
                    </a>
                    :
                    <a key={index}
                      href="#"
                      className={`btn ${social.colorBtn} d-flex align-items-center me-2 btn-sm`}
                    >
                      <FontAwesomeIcon icon={social.icon} />
                      <span className='d-none d-md-inline ms-1'>{social.name}</span>
                    </a>
                )}


              </div>
            </div>

            <div className="col-lg-8">


              {images?.length > 0 ?
                <img src={images?.[currentImageIndex].hinhdaidien || `https://demodienmay.125.atoz.vn/${data?.hinhdaidien}`} alt={data?.tieude}
                  width={'100%'} height={'450px'} />
                :
                <img src={`https://demodienmay.125.atoz.vn/${data?.hinhdaidien}`} alt={data?.tieude}
                  width={'100%'} height={'450px'} />
              }

              {/* Hình ảnh chi tiết */}
              <div
                className="navigator-content d-flex justify-content-center"
                style={{ display: "flex", flexWrap: "nowrap" }}
              >
                {
                  images?.map((image: any, index: number) => (
                    <div
                      key={image.id}
                      className="slide-item col-lg-1 col-md-2 col-3 d-flex align-items-center justify-content-center"
                      data-index={0}
                      style={{ height: 100 }}
                    >
                      {/* <a
                        href={image.hinhdaidien}>
                        <img
                          src={image.hinhdaidien}
                          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "cover" }}
                        />
                      </a> */}
                      <button
                        onClick={() => setCurrentImageIndex(index)}>
                        <img
                          src={image.hinhdaidien}
                          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "cover" }}
                        />
                      </button>
                    </div>
                  ))
                }
              </div>

              {/* Nội dung chi tiết sản phẩm */}
              <div dangerouslySetInnerHTML={{ __html: data?.noidungchitiet }} />
            </div>

            <div className="col-lg-4">
              {/* Thông tin sản phẩm  */}
              <div className="wrap-thongtinchinh bg-light px-1 mb-3">
                <div className="thongtinnhanhsanpham khuvucboloctimkiem">
                  <div className="detail-item">
                    <i className="fa fa-tag text-info" />{" "}
                    <strong className="text-info">Thương hiệu:</strong>{" "}
                    <a href="/hang-may-tinh-Apple" data-cat="l" data-id="hang-may-tinh-Apple">
                      Apple
                    </a>
                  </div>
                  <div className="detail-item">
                    <i className="fa fa-microchip text-success" />{" "}
                    <strong className="text-success">CPU:</strong>{" "}
                    <a href="/apple-m1" data-cat="l" data-id="apple-m1">
                      Apple M1
                    </a>
                  </div>
                  <div className="detail-item">
                    <i className="fa fa-memory text-info" />{" "}
                    <strong className="text-info">Dung lượng RAM:</strong>{" "}
                    <a href="/ram-may-tinh-16gb" data-cat="l" data-id="ram-may-tinh-16gb">
                      16GB
                    </a>
                  </div>
                  <div className="detail-item">
                    <i className="fa fa-hdd text-success" />{" "}
                    <strong className="text-success">Ổ cứng:</strong>{" "}
                    <a href="/ssd-1tb" data-cat="l" data-id="ssd-1tb">
                      SSD 1TB
                    </a>
                  </div>
                  <div className="detail-item">
                    <i className="fa fa-image text-primary" />{" "}
                    <strong className="text-primary">Card đồ họa:</strong>{" "}
                    <a href="/card-onboard" data-cat="l" data-id="card-onboard">
                      Card onboard
                    </a>
                  </div>
                  <div className="detail-item">
                    <i className="fa fa-tv text-success" />{" "}
                    <strong className="text-success">Kích cỡ màn hình:</strong>{" "}
                    <a
                      href="/may-tinh-man-hinh-19-24-inch"
                      data-cat="l"
                      data-id="may-tinh-man-hinh-19-24-inch"
                    >
                      19-24 inch
                    </a>
                  </div>
                </div>
                <div className="thongtinnhanhsanpham ndchitiettomtat">&nbsp;</div>
                <p className="masanpham">
                  <span id="strProductCode">Mã:</span> <span itemProp="sku">60005</span>
                </p>
              </div>

              {/* Action btns */}
              <div className="wrap-dinhkem bg-light border-top px-1 mb-3">
                <div
                  className="wrap-dathang px-2"
                  style={{ position: "relative", transform: "translate3d(0px, 0px, 0px)" }}
                >
                  <div className="giasanpham cokhuyenmai bg-light rounded-3 p-3 mb-2">
                    <span itemProp="offers" itemType="https://schema.org/Offer">
                      <div className="fs-4 fw-bold mb-1">
                        <span className="text-primary">Giá bán:</span>{" "}
                        <span className="text-success" itemProp="price" />
                        <span className="dvt" itemProp="priceCurrency" content="VND">
                          VND
                        </span>
                      </div>
                      <meta itemProp="availability" content="https://schema.org/InStock" />
                    </span>
                  </div>
                  <p className="muangay pt-2">
                    <a
                      className="addtocart_detail btn btn-primary btn-lg btn-block w-100"
                      href="javascript:void(0)"
                      rel="nofflow"
                      data-ma={60005}
                    >
                      <i className="fa fa-money-check-alt" /> Mua
                    </a>
                  </p>
                </div>
                <div className="wrap-nutmua px-2 pb-2 mt-1">
                  <div className="d-flex justify-content-between align-items-center mx-auto">
                    <div className="btn-group w-100">
                      <button className="btn btn-outline-success btn-success"
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                      ><FontAwesomeIcon icon={faCartShopping} /> Giỏ hàng
                      </button>
                      <button className="btn btn-outline-info btn-info text-warning"
                        onClick={handleAddToWishlist}
                        disabled={addingToWishlist}>
                        WISHLIST
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comment box */}
          <div className="cmtBox row">
            <div className="my-avatar col-1">
              <img className="user-avatar" src="/dist/images/user.jpg" />
            </div>
            <div className="kvbl col-11">
              <div className="wr">
                <textarea
                  className="txtNoiDung"
                  placeholder="Nội dung bình luận"
                  style={{ minHeight: '200px', width: '100%' }}
                  defaultValue={""}
                />
                <div className="submit-bl">
                  <div className="register-comment" style={{ display: "none" }}>
                    <div className="nl">
                      <div className="ten">
                        <input className="cmt-name" placeholder="Họ tên" />
                      </div>
                      <div className="d-flex">
                        <div className="mail">
                          <input className="cmt-email" placeholder="Email" />
                        </div>
                        <div className="dt">
                          <input className="cmt-tel" placeholder="Điện thoại" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="submit d-flex">
                    <div className="dg">
                      <span
                        className="rateit"
                        data-rateit-value={5}
                        data-rateit-ispreset="true"
                        data-rateit-resetable="false"
                      >
                        <button
                          id="rateit-reset-2"
                          type="button"
                          data-role="none"
                          className="rateit-reset"
                          aria-label="reset rating"
                          aria-controls="rateit-range-2"
                          style={{ display: "none" }}
                        />
                        <span
                          id="rateit-range-2"
                          className="rateit-range"
                          tabIndex={0}
                          role="slider"
                          aria-label="rating"
                          aria-owns="rateit-reset-2"
                          aria-valuemin={0}
                          aria-valuemax={5}
                          aria-valuenow={5}
                          aria-readonly="false"
                          style={{ width: 80, height: 16 }}
                        >
                          <span
                            className="rateit-selected rateit-preset"
                            style={{ height: 16, width: 80 }}
                          />
                          <span className="rateit-hover" style={{ height: 16 }} />
                        </span>
                      </span>
                    </div>
                    <div className="btn-sm">
                      <button className="btnNewBinhLuan newcmt">Bình luận</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="fs-4 text-uppercase mt-3">Sản phẩm liên quan</h2>
          {/* Sản phẩm liên quan */}
          <ProductContainer id="35279" />
        </div>
      </div>
    </main >
  )
}