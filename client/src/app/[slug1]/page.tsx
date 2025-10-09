'use client';

import ProductContainer from "@/components/products/ProductContainer";
import { useParams } from "next/navigation";
import NotFound from "./not-found";
import LeftContent from "@/components/pagebody/LeftContent";
import FilterBox from "@/components/filter/FilterDetail";


const categoryMap: Record<string, string> = {
    "mua-ban-may-tinh": "35279",
    "tivi": "35280",
    "mua-ban-dien-thoai-di-dong": "35285",
    "may-lanh": "35283",
}

// Các trang danh mục sản phẩm
export default function Category() {
    // Dùng useParams để lấy slug từ URL
    const { slug1 } = useParams();

    const categoryId = categoryMap[slug1 as string]; // Lấy id từ slug

    console.log('categoryId => ', categoryId);


    // Nếu không tìm thấy đường đẫn => not found
    if (!categoryId) return <NotFound />

    return (
        <main role="main" className="container-lg">
            <div className="row">
                <div className="col-lg-3">
                    <LeftContent />
                    <FilterBox />
                </div>
                <div className="col-lg-9">
                    <ProductContainer id={categoryId} />
                </div>
            </div>
        </main>
    )
}