"use client";

import { RootState } from "@/redux/store";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse } from "bootstrap";

import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function LeftContent() {
  const { leftContent, navbar } = useSelector(
    (state: RootState) => state.contents
  );

  // console.log("leftContent", leftContent);


  // =========================== Left menu new ===========================
  type Category = {
    id: string;
    title: string;
    children?: { id: string; title: string }[];
  };

  const data: Category[] = [
    { id: "reg", title: "Đăng ký" },
    {
      id: "science",
      title: "Khoa học",
      children: [
        { id: "space", title: "Vũ trụ" },
        { id: "nature", title: "Thế giới tự nhiên" },
      ],
    },
    {
      id: "tech",
      title: "Công nghệ",
      children: [
        { id: "ai", title: "AI" },
        { id: "digit", title: "Chuyển đổi số" },
        { id: "life", title: "Nhịp sống số" },
        { id: "device", title: "Thiết bị" },
        { id: "exp", title: "Trải nghiệm" },
      ],
    },
  ];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    science: true,
    tech: true,
  });

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }


  // return (
  //   <div className="p-3 rounded">
  //     {leftContent.length > 0 && (
  //       <ul className="list-unstyled m-0 p-0">
  //         {leftContent.map((l, index) => {
  //           const parent = navbar?.find((nav) => nav.id == l.id);
  //           return (
  //             <li
  //               key={index}
  //               className="border-bottom position-relative py-2 group"
  //             >
  //               <div className="d-flex align-items-center justify-content-between">
  //                 <Link
  //                   href={`/${l.tieude === "Trang chủ"
  //                     ? "/"
  //                     : `${l.kieuhienthi.toLocaleLowerCase()}/${l.id}`
  //                     }`}
  //                   className="text-dark fw-semibold fs-6 d-flex align-items-center gap-1 text-decoration-none"
  //                 >
  //                   {l.tieude}
  //                   {parent && <FontAwesomeIcon icon={faChevronDown} />}
  //                 </Link>
  //               </div>

  //               {/* Dropdown */}
  //               {parent && parent.children && parent.children.length > 0 && (
  //                 <ul className="dropdown-menu-custom list-unstyled">
  //                   {parent.children?.map((mn) => (
  //                     <li key={mn.id}>
  //                       <Link
  //                         className="dropdown-item-custom"
  //                         href={`/${parent.kieuhienthi.toLocaleLowerCase()}/${mn.id
  //                           }`}
  //                       >
  //                         {mn.tieude}
  //                       </Link>
  //                     </li>
  //                   ))}
  //                 </ul>
  //               )}
  //             </li>
  //           );
  //         })}
  //       </ul>
  //     )}
  //   </div>
  // );

  return (
    <aside className="sidebar-menu">
      <div className="list-group">
        {data.map((cat) =>
          !cat.children ? (
            <button
              key={cat.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              type="button"
            >
              {cat.title}
            </button>
          ) : (
            <div key={cat.id}>
              <button
                type="button"
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={() => toggleGroup(cat.id)}
              >
                <span>{cat.title}</span>
                <span className="toggle-sign">
                  {openGroups[cat.id] ? "−" : "+"}
                </span>
              </button>

              {/* Danh mục con */}
              <div className={`children-wrapper ${openGroups[cat.id] ? "show" : "hidden"}`}>
                {cat.children.map((child) => (
                  <button
                    key={child.id}
                    className="list-group-item list-group-item-action ps-4"
                    type="button"
                  >
                    {child.title}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* CSS inline */}
      <style jsx>{`
        .sidebar-menu {
          max-width: 320px;
        }
        .list-group-item {
          border: none;
          border-bottom: 1px solid #e9ecef;
        }
        .toggle-sign {
          font-size: 18px;
          line-height: 1;
        }
        .children-wrapper.hidden {
          display: none;
        }
        .children-wrapper.show {
          display: block;
        }
        .ps-4 {
          padding-left: 1.5rem !important;
        }
      `}</style>
    </aside>
  );
}