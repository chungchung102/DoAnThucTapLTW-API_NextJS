import { fetchFromApi } from "@/utils/fetchFromApi";

export interface NewsItem {
    id: string;
    ngaydang: string;
    hinhdaidien: string;
    tieude: string;
    url: string;
    noidungtomtat: string;
}



export async function fetchNews(): Promise<NewsItem[]> {
    const res = await fetchFromApi("/ww2/module.tintuc.trangchu.asp?id=35139");
    const data = await res.json();
    return data[0]?.data || [];
}
