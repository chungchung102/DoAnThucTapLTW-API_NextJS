import { fetchFromApi } from "../lib/apiClient";

export interface CategoryItem {
    idpart: string;
    idquanly?: string;
    module?: string;
    tenham: string;
    noidungtab?: unknown[];
    hinhdaidien?: string;
    tieude: string;
    url?: string;
    kieu?: string;
    cachhienthi?: string;
    recorditem?: string;
    csshome?: string;
    tomtat?: string;
}



export async function fetchCategories(): Promise<CategoryItem[]> {
    const res = await fetchFromApi("/ww2/web.trangchu.module.content.asp");
    return await res.json();
}

export async function fetchCategoryById(id: string): Promise<CategoryItem | undefined> {
    const categories = await fetchCategories();
    return categories.find((item: CategoryItem) => item.tenham === 'Sanpham' && item.idpart === id);
}

export async function fetchProductCategories(ids: string[]): Promise<CategoryItem[]> {
    const categories = await fetchCategories();
    return categories.filter((item: CategoryItem) => item.tenham === 'Sanpham' && ids.includes(item.idpart));
}
