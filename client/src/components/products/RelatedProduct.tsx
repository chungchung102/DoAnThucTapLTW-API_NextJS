import { RootState } from "@/redux/store";
import { formatGia } from "@/redux/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

export default function Relatedproduct({ id }: { id: string }) {
  const { productRelated } = useSelector((state: RootState) => state.contents);
  return (
    <div>
      <div>
        {productRelated ? (
          <section className="py-4">
            <h6 className="fw-bold text-success border-bottom border-3 border-success">
              {productRelated.tieude?.toString().toLocaleUpperCase()}
            </h6>

            {/* Hiển thị danh sách sản phẩm */}

            <div className="">
              <div className="row row-cols-2 row-cols-lg-3 g-2">
                {productRelated.data?.map((pro) => (
                  <div className="col" key={pro.id}>
                    <Link
                      href={`/sanpham/${id}/${pro.id}`}
                      className="border h-100 bg-white d-block text-decoration-none text-dark p-2 zoom-hover"
                    >
                      {/* Khuyến mãi */}

                      <div className="mb-2">
                        <span className="p-1 text-bg-danger rounded">
                          {pro.giakhuyenmai}%
                        </span>
                      </div>
                      {/* Hình ảnh */}
                      <div className="d-flex justify-content-center mb-2">
                        {pro.hinhdaidien && (
                          <Image
                            src={`${pro.hinhdaidien}`}
                            alt={pro.tieude}
                            width={200}
                            height={200}
                            className="img-fluid"
                          />
                        )}
                      </div>

                      {/* Thông tin */}
                      <div>
                        <p className="text-truncate">{pro.tieude}</p>
                        <p className="text-danger">
                          &#8363; {formatGia(pro.gia)}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
