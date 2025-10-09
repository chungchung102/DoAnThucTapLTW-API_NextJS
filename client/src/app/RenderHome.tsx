// Render main content trang chủ
"use client";

import NewsPage from "@/components/news/NewsPage_new";
import LeftContent from "@/components/pagebody/LeftContent";
import ProductContainer from "@/components/products/ProductContainer";
import Link from "next/link";
import React from "react";

export default function RenderHome() {
  // const dispatch = useDispatch<AppDispatch>();
  // const { homeContent } = useSelector((state: RootState) => state.contents);

  // useEffect(() => {
  //   const renderContentHome = async () => {
  //     const actionResult = await dispatch(getHomeContentApi());
  //   };

  //   renderContentHome();
  // }, [dispatch]);

  // const _homeContent = homeContent?.[0]?.data;
  // console.log('_homeContent => ', _homeContent);


  return (
    <>
      <main role="main" className="container-lg">
        <div id="dautrang">
          <div className="dautrang container"> </div>
        </div>

        {/* Left content (25%) */}
        <div className="row">
          <div className="col-lg-3">
            <LeftContent />

          </div>
          {/* Main content (50%) mobile mode (100% padding x-2) */}
          <div className="col-lg-9">
            <div className="py-2">
              {/* Các sản phẩm */}
              <div className="border-bottom">
                <Link href={'mua-ban-may-tinh'} className="m-0 text-white bg-primary p-2 fs-4">Máy vi tính</Link>
              </div>
              <ProductContainer id="35279" />

              <div className="border-bottom">
                <Link href={'tivi'} className="m-0 text-white bg-primary p-2  fs-4">Tivi</Link>
              </div>
              <ProductContainer id="35280" />

              <div className="border-bottom">
                <Link href={'may-lanh'} className="m-0 text-white bg-primary p-2  fs-4">Máy lạnh</Link>
              </div>
              <ProductContainer id="35283" />

              <div className="border-bottom">
                <Link href={'mua-ban-dien-thoai-di-dong'} className="m-0 text-white bg-primary p-2  fs-4">Điện thoại</Link>
              </div>
              <ProductContainer id="35285" />

              {/* Tin tức */}
              <NewsPage />
            </div>
          </div>
        </div>
      </main>

      <section className="hotline full-width mb-3" id="st35123">
        <div className="container ct35123 mdtintuc thquangcao width-lg">
          <div className="row">
            <div className="nhomtomtat col-md-12">
              <div className="container text-center my-4 width-lg">
                <div className="p-4 border rounded bg-primary text-white shadow-lg">
                  <h2 className="fw-bold">
                    🚀 Nâng tầm trải nghiệm công nghệ cùng{" "}
                    <span className="text-warning">Chồi Xanh Media</span>! 🖥️💻
                  </h2>
                  <p className="fs-5 mt-3">
                    🎉 <strong>Đăng ký thành viên</strong> ngay hôm nay để nhận ưu đãi
                    độc quyền và cập nhật nhanh nhất các sản phẩm công nghệ mới nhất!
                    📢💡
                  </p>
                  <p className="fs-5">
                    📲 <strong>Tải ngay ứng dụng</strong> của chúng tôi trên{" "}
                    <i className="fab fa-android" /> Android &amp;{" "}
                    <i className="fab fa-apple" /> iOS để mua sắm tiện lợi, quản lý
                    đơn hàng dễ dàng và nhận thông báo ưu đãi nhanh chóng! 🎁
                  </p>
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <a href="#" className="btn btn-light fw-bold px-4 py-2 shadow">
                      🛒 Mua sắm ngay
                    </a>
                    <a href="#" className="btn btn-warning fw-bold px-4 py-2 shadow">
                      📌 Đăng ký thành viên
                    </a>
                    <a href="#" className="btn btn-success fw-bold px-4 py-2 shadow">
                      📥 Tải ứng dụng Android
                    </a>
                    <a href="#" className="btn btn-dark fw-bold px-4 py-2 shadow">
                      🍏 Tải ứng dụng iOS
                    </a>
                  </div>
                  <div className="mt-4">
                    <p className="fs-5 fw-bold">
                      📞 Hotline tư vấn:{" "}
                      <a
                        href="tel:0907240247"
                        className="text-warning fw-bold text-decoration-none"
                      >
                        <i className="fas fa-phone-alt" /> 0907 240 247
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* <div className="row">
        {
          _homeContent?.map((content: Content) => {
          })
        }
      </div> */}


      {/* if (content.kieuhienthi === "Sanpham") {
            return (
      <div key={content.id}>
        <ProductContainer id={content.id.toString()} />
        <p>{content.tieude}</p>
      </div>
      );
          }
      if (content.kieuhienthi === "Tintuc") {
            return (
      <div key={content.id}>
        <NewsPage id={content.id.toString()} />
      </div>
      );
          }
      if (content.kieuhienthi === "Lienhe") {
            return (
      <div key={content.id}>
        <ContactForm id={content.id.toString()} />
      </div>
      );
          }
      return null;
        })} */}
    </>
  )
}
