"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SpinAnimation from "../items/SpinAnimation";
import { formatGia } from "@/redux/utils";
import { getProduct } from "@/redux/api/reduxContentApi";
import ProductCard from "./ProductCard";

// Tạo interface cho ProductCard 
// interface ProductCard {
//   product: {
//     id: string;
//     tieude: string;
//     hinhdaidien: string;
//     gia: string;
//     giakhuyenmai: string;
//     thuonghieu?: Array<{ tengoi: string; url: string }>;
//     cpu?: Array<{ tengoi: string; url: string }>;
//     mainboard?: Array<{ tengoi: string; url: string }>;
//     dungluongram?: Array<{ tengoi: string; url: string }>;
//     ram?: Array<{ tengoi: string; url: string }>;
//     ocung?: Array<{ tengoi: string; url: string }>;
//     carddohoa?: Array<{ tengoi: string; url: string }>;
//     kichcomanhinh?: Array<{ tengoi: string; url: string }>;
//     bonhotrong?: Array<{ tengoi: string; url: string }>;
//     chipxuli?: Array<{ tengoi: string; url: string }>;
//     kichcomanhinhtivi?: Array<{ tengoi: string; url: string }>;
//     hangsanxuat?: Array<{ tengoi: string; url: string }>;
//     congsuat?: Array<{ tengoi: string; url: string }>;
//   };
// }

export default function ProductContainer({ id }: { id: string }) {
  // Fetch sản phẩm
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.contents
  );

  // Track các ảnh bị lỗi
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  const handleImageError = (imageUrl: string) => {
    setBrokenImages(prev => {
      const newSet = new Set(prev);
      newSet.add(imageUrl);
      setRefreshKey(current => current + 1); // Force re-render
      return newSet;
    });
  };

  // Get products when id changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await dispatch(getProduct({ id: id }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [dispatch, id]);

  if (loading == true) {
    return <SpinAnimation />;
  }

  // console.log("products", products[id]); // log ra danh sách products theo id

  return (
    <div>
      {products[id] && products[id].length > 0
        ? products[id].map((apiResponse) => {
          const filteredProducts = apiResponse.data?.filter(item =>
            item.hinhdaidien &&
            item.hinhdaidien.trim() !== '' &&
            !brokenImages.has(item.hinhdaidien) &&
            item.tieude !== "Lỗi kết nối" &&
            !item.tieude.toLowerCase().includes("lỗi")
          ) || [];

          return (
            <section key={`section-${id}-${apiResponse.recordsTotal}`} className="mb-4">
              <div className="d-block">
                <div className="row ">
                  {filteredProducts.map((item) => (
                    <div className="col-md-6 col-xl-4" key={item.id}>
                      <ProductCard
                        product={item}
                        brokenImages={brokenImages}
                        onImageError={handleImageError}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })
        : (
          <div className="text-center py-4">
            <p className="text-muted">Không có sản phẩm nào</p>
          </div>
        )}
    </div>
  );
}
