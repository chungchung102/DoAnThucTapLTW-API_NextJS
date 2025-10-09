'use client';

import { fetchNews } from "@/api/newsApi";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NewsItem {
    id: string;
    ngaydang: string;
    hinhdaidien: string;
    tieude: string;
    url: string;
    noidungtomtat: string;
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Hiển thị 6 tin tức mỗi trang
    const [loading, setLoading] = useState(true);

    // Lấy dữ liệu tin tức từ API khi component được mount
    // useEffect(() => {
    //     // Cách mới với async/await
    //     try {
    //         const getNews = async () => {
    //             const res = await fetch("https://demodienmay.125.atoz.vn/ww2/module.tintuc.trangchu.asp?id=35139");
    //             // const res = await fetch("https://nhipcautamgiao.net/ww2/module.tintuc.asp?id=1917130");
    //             const data = await res.json();
    //             setNews(data[0]?.data || []);
    //             setLoading(false);
    //         }

    //         getNews();
    //     } catch (error) {
    //         console.log(error);
    //         setLoading(false);
    //     }
    // }, []);

    useEffect(() => {
        fetchNews()
            .then((data) => {
                setNews(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p>Đang tải tin tức...</p>;

    return (
        <section className="container py-4">
            <div className="border-bottom">
                <h2 className="fw-bold text-white bg-primary d-inline-block fs-4 p-2" >
                    Tin tức
                </h2>
            </div>

            {/* Hiển thị danh sách tin tức */}
            <div className="row row-cols-2 g-4">
                {(() => {
                    // Lọc bỏ các tin tức có hình đại diện trống hoặc bị lỗi
                    const filteredNews = news.filter(item =>
                        item.hinhdaidien &&
                        item.hinhdaidien.trim() !== '' &&
                        !brokenImages.has(item.hinhdaidien) &&
                        item.tieude !== "Lỗi kết nối" &&
                        !item.tieude.toLowerCase().includes("lỗi")
                    );

                    // Phân trang
                    const startIndex = (currentPage - 1) * itemsPerPage; // Chỉ mục bắt đầu
                    const endIndex = startIndex + itemsPerPage; // Chỉ mục kết thúc
                    const currentItems = filteredNews.slice(startIndex, endIndex); // Lấy các mục của trang hiện tại

                    return currentItems.map((item) => (
                        <div className="col" key={item.id}>
                            <Link
                                href={`/tintuc/${item.url}-${item.id}`}
                                className="text-decoration-none text-dark"
                            >
                                <div className="row">
                                    <div className="col-lg-3">
                                        {item.hinhdaidien && !brokenImages.has(item.hinhdaidien) ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={item.hinhdaidien}
                                                alt={item.tieude}
                                                className="card-img-top rounded"
                                                style={{ width: "100%", objectFit: "contain" }}
                                                onError={() => {
                                                    setBrokenImages(prev => {
                                                        const newSet = new Set(prev);
                                                        newSet.add(item.hinhdaidien);
                                                        setRefreshKey(current => current + 1);
                                                        return newSet;
                                                    });
                                                }}
                                            />
                                        ) : null}
                                    </div>

                                    <div className="col-lg-9">
                                        <h6 className="card-title fw-bold text-truncate text-primary">{item.tieude}</h6>
                                        <p className="card-text text-muted text-truncate">{item.noidungtomtat}</p>
                                        <small className="text-muted">
                                            <i className="fas fa-calendar-alt me-1"></i>
                                            {item.ngaydang}
                                        </small>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ));
                })()}
            </div>

            {/* Phân trang */}
            {(() => {
                const filteredNews = news.filter(item =>
                    item.hinhdaidien &&
                    item.hinhdaidien.trim() !== '' &&
                    !brokenImages.has(item.hinhdaidien) &&
                    item.tieude !== "Lỗi kết nối" &&
                    !item.tieude.toLowerCase().includes("lỗi")
                );

                const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

                if (totalPages <= 1) return null;

                return (
                    <nav className="my-5">
                        <ul className="pagination justify-content-center">
                            <li className="page-item">
                                <button
                                    className={`page-link ${currentPage === 1 ? 'disabled' : ''} btn btn-primary`}
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    <i className="fas fa-chevron-left me-1"></i>
                                    Quay lại
                                </button>
                            </li>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <li className="page-item" key={pageNum}>
                                        <button
                                            className={`page-link ${currentPage === pageNum ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(pageNum)}
                                            style={{
                                                backgroundColor: currentPage === pageNum ? '#0d6efd' : 'transparent',
                                                borderColor: '#0d6efd',
                                                color: currentPage === pageNum ? 'white' : '#0d6efd'
                                            }}
                                        >
                                            {pageNum}
                                        </button>
                                    </li>
                                );
                            })}

                            <li className="page-item">
                                <button
                                    className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`}
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Kế tiếp
                                    <i className="fas fa-chevron-right ms-1"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                );
            })()}
        </section>
    )
}