"use client";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpinAnimation from "../items/SpinAnimation";
import { getNews } from "@/redux/api/reduxContentApi";

export default function NewsPage({ id }: { id: string }) {
  // Lấy dữ liệu từ Redux store
  const { news, loading } = useSelector((state: RootState) => state.contents);

  // Sử dụng useDispatch để gọi action
  const dispatch = useDispatch<AppDispatch>();

  const [page, setPage] = useState<number>(1);

  // Fetch news when component mounts or id/page changes
  useEffect(() => {
    const fetchNews = async () => {
      await dispatch(getNews({ id: id, sl: 30, page: page }));
    };
    fetchNews();
  }, [dispatch, id, page]);

  console.log("news", news);


  // Show loading spinner if loading
  if (loading == true) {
    return <SpinAnimation />;
  }

  // return news[id] ? (
  //   <section className="py-5">
  //     <h4 className="fw-bold text-success border-bottom border-3 border-success pb-2 mb-4">
  //       TIN TỨC
  //     </h4>
  //     <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
  //       {news[id]?.map((blog) =>
  //         blog.data.map((item) => (
  //           <div className="col" key={item.id}>
  //             <Link
  //               href={`/${blog.module.toLocaleLowerCase()}/${id}/${item.id
  //                 }`}
  //               className="text-decoration-none text-dark"
  //             >
  //               <div className="h-100 shadow-sm border-0">
  //                 {item.hinhdaidien && (
  //                   <Image
  //                     src={item.hinhdaidien}
  //                     width={400}
  //                     height={250}
  //                     alt={item.tieude}
  //                     className="card-img-top object-fit-cover"
  //                     style={{ blockSize: "200px" }}
  //                   />
  //                 )}
  //                 <div className="card-body">
  //                   <h6 className="card-title fw-bold">{item.tieude}</h6>
  //                   <small className="text-muted">
  //                     {item.ngaydang.toLocaleString()}
  //                   </small>
  //                   <div
  //                     dangerouslySetInnerHTML={{ __html: item.tomtat }}
  //                     className="card-text mt-2 text-secondary"
  //                   />
  //                 </div>
  //               </div>
  //             </Link>
  //           </div>
  //         ))
  //       )}
  //     </div>
  //     <nav className="my-5">
  //       <ul className="pagination justify-content-center">
  //         <li className="page-item">
  //           <button
  //             className="page-link"
  //             disabled={page == 1}
  //             onClick={(e) => {
  //               e.preventDefault();
  //               setPage(page - 1);
  //             }}
  //           >
  //             PREV
  //           </button>
  //         </li>
  //         <li className="page-item">
  //           <button
  //             onClick={(e) => {
  //               e.preventDefault();
  //               setPage(1);
  //             }}
  //             className="page-link"
  //           >
  //             1
  //           </button>
  //         </li>
  //         <li className="page-item">
  //           <button
  //             onClick={(e) => {
  //               e.preventDefault();
  //               setPage(2);
  //             }}
  //             className="page-link"
  //           >
  //             2
  //           </button>
  //         </li>
  //         <li className="page-item">
  //           <button
  //             onClick={(e) => {
  //               e.preventDefault();
  //               setPage(3);
  //             }}
  //             className="page-link"
  //           >
  //             3
  //           </button>
  //         </li>
  //         <li className="page-item">
  //           <button
  //             onClick={(e) => {
  //               e.preventDefault();
  //               setPage(4);
  //             }}
  //             className="page-link"
  //           >
  //             4
  //           </button>
  //         </li>
  //         <li className="page-item">
  //           <button className="page-link">
  //             {page == 1 ? "..." : "Trang hiện tại " + page}
  //           </button>
  //         </li>
  //         <li className="page-item">
  //           <button
  //             className="page-link"
  //             onClick={(e) => {
  //               e.preventDefault();
  //               setPage(page + 1);
  //             }}
  //           >
  //             NEXT
  //           </button>
  //         </li>
  //       </ul>
  //     </nav>
  //   </section>
  // ) : <h1>Tin tức không có dữ liệu</h1>;
}
