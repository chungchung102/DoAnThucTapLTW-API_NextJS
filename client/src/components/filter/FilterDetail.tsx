"use client";

import { useEffect, useState } from "react";

// ---- Interface (định nghĩa kiểu dữ liệu) ---- //
interface OptionItem {
    tengoi: string; // Tên hiển thị (ví dụ: Acer, Apple...)
    ma: string;     // Mã của option
    url: string;    // Đường dẫn liên kết (nếu cần)
}

interface DetailResponse {
    ten: string;            // Tiêu đề (ví dụ: Thương hiệu, CPU, RAM)
    ma: string;             // Mã của tiêu đề
    thamso: OptionItem[];   // Danh sách các option bên trong
}

interface MasterItem {
    id: string;       // Id của bộ lọc (dùng để gọi API chi tiết)
    tieude: string;   // Tiêu đề hiển thị (Thương hiệu, CPU, RAM…)
    url: string;      // Đường dẫn
}

// ---- Component chính ---- //
export default function FilterBox() {
    // State lưu toàn bộ bộ lọc (mỗi phần gồm title + options)
    const [filters, setFilters] = useState<
        { title: string; options: OptionItem[]; id: string }[]
    >([]);

    // State riêng cho ô tìm kiếm thương hiệu
    const [search, setSearch] = useState("");

    // ---- Gọi API khi load trang ---- //
    useEffect(() => {
        async function fetchFilters() {
            try {
                // 1. Gọi API master để lấy danh sách tiêu đề
                const resMaster = await fetch(
                    "https://demodienmay.125.atoz.vn/ww2/crm.boloc.master.asp?id=35279"
                );
                const masterData: MasterItem[] = await resMaster.json();

                const results: { title: string; options: OptionItem[]; id: string }[] =
                    [];

                // 2. Với mỗi master item → gọi API chi tiết
                for (const item of masterData) {
                    const resDetail = await fetch(
                        `https://demodienmay.125.atoz.vn/ww2/crm.boloc.chitiet.asp?id=${item.id}`
                    );
                    const detailData: DetailResponse[] = await resDetail.json();

                    // 3. Nếu API trả về hợp lệ → push vào mảng kết quả
                    if (detailData.length > 0) {
                        results.push({
                            title: detailData[0].ten,      // Tiêu đề (Thương hiệu, CPU…)
                            options: detailData[0].thamso, // Danh sách tùy chọn
                            id: item.id,                   // Id để key React
                        });
                    }
                }

                // 4. Cập nhật state filters
                setFilters(results);
            } catch (err) {
                console.error("Lỗi fetch API:", err);
            }
        }

        fetchFilters();
    }, []);

    // ---- Render giao diện ---- //
    return (
        <div>
            {filters.map((filter) => {
                // Nếu là Thương hiệu → áp dụng lọc theo ô search
                const filteredOptions =
                    filter.title === "Thương hiệu"
                        ? filter.options.filter((opt) =>
                            opt.tengoi.toLowerCase().includes(search.toLowerCase())
                        )
                        : filter.options;

                return (
                    <div
                        key={filter.id}
                        className="p-3 mb-3 border rounded"
                        style={{ maxHeight: "250px", overflowY: "auto" }}
                    >
                        {/* Tiêu đề */}
                        <h6 className="text-primary">{filter.title}</h6>

                        {/* Nếu là Thương hiệu thì có thêm ô tìm kiếm */}
                        {filter.title === "Thương hiệu" && (
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Lọc trong thương hiệu..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        )}

                        {/* Danh sách nút */}
                        <div className="d-flex flex-wrap gap-2">
                            {filteredOptions.map((opt) => (
                                <button
                                    key={opt.ma}
                                    className="btn btn-light border rounded-pill px-3 py-1"
                                >
                                    {opt.tengoi}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
