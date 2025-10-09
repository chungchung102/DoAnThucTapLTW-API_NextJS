import type { Metadata } from "next";
import "./globals.css";
import "@/components/icon/fontawesome";
import 'bootstrap/dist/css/bootstrap.min.css';

import HeaderTop from "@/components/header/HeaderTop";
import BannerPage from "./[slug1]/[slug2]/BannerPage";
import Header from "@/components/header/Header";
import RightContent from "@/components/pagebody/RightContent";
import LeftContent from "@/components/pagebody/LeftContent";
import Map from "@/components/items/Map";
import Footer from "@/components/footer/footer";

import AppProvider from "@/redux/AppProvider";
import { ReduxProvider } from "@/redux/provider";
import Script from "next/script";
import Link from "next/link";
import { ToastProvider } from "@/components/ui/ToastProvider";
//boot script

export const metadata: Metadata = {
  title:
    "Công ty Chồi Xanh Media - Chuyên cung cấp máy tính và thiết bị công nghệ",
  description:
    "Chồi Xanh Media cung cấp các loại máy tính, laptop và thiết bị công nghệ chất lượng cao, đáp ứng mọi nhu cầu của doanh nghiệp và cá nhân",
  keywords: [
    "máy tính, laptop, PC, thiết bị công nghệ, phần cứng máy tính, Chồi Xanh Media",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // return (
  //   <html lang="eng">
  //     <body>
  //       <ReduxProvider>
  //         <AppProvider>
  //           {/* Header */}
  //           <header>
  //             <HeaderTop />
  //             <BannerPage />
  //             <Header />
  //           </header>

  //           {/* Body */}
  //           <main className="container-lg">
  //             {/* Left content (25%) */}
  //             <div className="row">
  //               <div className="col-lg-3">
  //                 <LeftContent />
  //               </div>
  //               {/* Main content (50%) mobile mode (100% padding x-2) */}
  //               <div className="col-lg-9">{children}</div>


  //               {/* Right content (25%) (mobile-none) */}
  //               {/* <div className="col-lg-3">
  //                 <RightContent />
  //               </div> */}
  //             </div>
  //           </main>

  //           {/* Footer */}
  //           <footer>
  //             <Map />
  //             <Footer />
  //           </footer>
  //         </AppProvider>
  //       </ReduxProvider>
  //     </body>
  //   </html>
  // );

  return (
    <html itemScope itemType="https://schema.org/WebPage" lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Language" content="vi" />
        <meta name="robots" content="INDEX,FOLLOW" />
        <meta httpEquiv="REFRESH" content="6000" />
        <link
          rel="canonical"
          href="https://demodienmay.125.atoz.vn/"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title=" - RSS"
          href="https://demodienmay.125.atoz.vn/trangchu-master.rss"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <meta name="format-detection" content="telephone=yes" />

        {/*  Preconnect để tăng tốc DNS & TLS  */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="preconnect" href="https://code.jquery.com" crossOrigin="" />
        <link rel="preconnect" href="https://kit-free.fontawesome.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="" />
        <link rel="preconnect" href="https://demodienmay.125.atoz.vn" crossOrigin="" />

        {/* CSS */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css" />
        <link rel="stylesheet" href="https://kit-free.fontawesome.com/releases/latest/css/free.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.0/jquery.fancybox.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jplayer@2.9.2/dist/skin/blue.monday/css/jplayer.blue.monday.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-simplyscroll/2.0.5/jquery.simplyscroll.min.css" />
        <link rel="stylesheet" href="https://demodienmay.125.atoz.vn/dist/css/choixanh.min.css?ver=2.11" />
        <link rel="stylesheet" href="https://demodienmay.125.atoz.vn/dist/css/web.css.asp" />

        <Script src="https://code.jquery.com/jquery-3.7.1.min.js"></Script>

        {/* Script biến global */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                let domainName = "https://demodienmay.125.atoz.vn/";
                let JsonDomainWW1 = domainName + "ww1";
                let JsonDomainWW2 = domainName + "ww2";
                let NgonNguLapTrinhAPI = "asp";
                let KieuMenuTrenDuoi = "1";
                let loaixuly = "web";
                let loaidangnhap = "";
                let userid = "";
                let pass = "";
                let userlogin = "";
                let DathangMabaogia = "5355";
                let WishlistMabaogia = "5356";
                let queryString = \`userid=\${encodeURIComponent(userid)}&pass=\${encodeURIComponent(pass)}\`;
                let loaicode = "";
                let apiKey = "";
                let apiLink = "";
                let apiGoogleTTSKey = "";
                let FacebookAPPID = '';
                let LinkedinClientID = '';
                if (loaixuly !== 'web') {
                  loaicode = '.' + loaixuly;
                }
              `,
          }}
        />
      </head>
      <body className="trangchu">
        <ReduxProvider>
          <AppProvider>
            <ToastProvider>
              {/* ==== Toàn bộ nội dung HTML body gốc ==== */}
              <header className="navigation">
                <HeaderTop />

                {/* Header Banner */}
                <div className="header-top">
                  <div className="container-xl">
                    <div className="row">
                      {" "}
                      <span className="wrap-brand">
                        {" "}
                        <span className="khuvuclogo pull-left brand">
                          <p style={{ textAlign: "center" }}>Banner đầu trang</p>
                        </span>{" "}
                      </span>
                      <div
                        itemType="https://schema.org/Organization"
                        className="recipe"
                      >
                        <span itemProp="name">demodienmay.125.atoz.vn</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Header />
              </header>

              {/* Nội dung chính */}
              {children}

              <footer>
                <Map />
                <Footer />
              </footer>

              {/* Nút scroll lên top */}
              <div style={{ textAlign: "center" }}></div>
              <a href="javascript:void(0)" id="toTop">
                <i className="fa fa-arrow-up"></i> TOP
              </a>

              {/* Placeholder kiểm tra khách hàng */}
              <span className="kiemtrakhachhang"></span>

              {/* Loading overlay */}
              {/* <div id="loading-overlay">
              <div className="onload">
                <span className="loading-text">Đang tải...</span>
              </div>
            </div> */}

              {/* Popup thông báo */}
              <span className="formthongbaopopupcenter"></span>

              {/* Các scripts */}
              {/* <Script src="/checkstatus/hosting.asp" strategy="afterInteractive" />  */}
              <Script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js" />
              <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" />
              <Script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js" />
              <Script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js" />
              <Script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js" />
              <Script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.0/jquery.fancybox.min.js" />
              <Script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js" />
              <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.3.0/jquery.form.min.js" />
              <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js" />
              <Script src="https://cdn.jsdelivr.net/npm/sticky-sidebar@3.3.1/dist/sticky-sidebar.min.js" />
              <Script src="https://cdnjs.cloudflare.com/ajax/libs/jplayer/2.9.2/jplayer/jquery.jplayer.min.js" />
              <Script src="https://cdnjs.cloudflare.com/ajax/libs/jplayer/2.9.2/add-on/jplayer.playlist.js" />
              <Script src="https://demodienmay.125.atoz.vn/dist/js/choixanh.min.js?ver=2.11" />
              <Script src="https://demodienmay.125.atoz.vn/dist/js/web.min.js?ver=2.11" />
              <Script src="https://demodienmay.125.atoz.vn/dist/js/main.asp" />
              <Script src="https://demodienmay.125.atoz.vn/dist/js/web.js.asp" />
            </ToastProvider>
          </AppProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}