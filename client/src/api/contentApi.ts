import {
  CheckoutPayload,
  ContactApi,
  // Content,  // Comment 
  ContentApi,
  ContentHeader,
  MenuHeader,
  NewApiResponse,
  News,
  NewsDetail,
  NewsRelatedType,
  PageCategories,
  ProductDetail,
  ProductRelated,
  Products,
  SearchedContentState,
} from "@/types/content.page.type";
import axios from "axios";
// api url
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//search content
export async function searchContent(key: string) {
  const res = await axios.get(`${apiUrl}/content/search-content`, {
    params: { query: key },
  });
  const data: SearchedContentState[] = res.data.data;
  return data;
}

//lấy menu chung của công ty
export async function getApiContentHeader() {
  const api = await axios.get(`${apiUrl}/content/get-content-header`);

  const menu: MenuHeader[] = api.data.header_content.menu;
  const content: ContentHeader = api.data.header_content.content;
  return {
    menu: menu,
    content: content,
  };
}

// lấy api nội dung hiện trên trang chủ
// export async function getHomeContent() {
//   const api = await axios.get(`https://demodienmay.125.atoz.vn/ww2/module.sanpham.trangchu.asp?id=35279`);
//   const data: NewApiResponse[] = api.data;
//   return data;
// }


// Api Tin tức
// export async function getHomeContent() {
//   const api = await axios.get("https://demodienmay.125.atoz.vn/ww2/module.tintuc.trangchu.asp?id=35139");
//   return api.data;
// }

export async function getHomeContent() {
  return [
    {
      id: 35139,
      kieuhienthi: "Tintuc"
    }
  ];
}


// lấy danh mục trên navbar
export async function getPageCategories() {
  const api = await axios.get(`https://demodienmay.125.atoz.vn/ww2/app.all.danhmuc.asp`);
  const data: PageCategories[] = api.data.menu;
  return data;
}

// lấy danh mục trái phải
// export async function getContent() {
//   try {
//     const contentApi = await axios.get(`${apiUrl}/content/get-wrap-content`);

//     const leftapi: ContentApi[] = contentApi.data.content.leftapi;
//     const rightapi: ContentApi[] = contentApi.data.content.rightapi;

//     return {
//       leftapi,
//       rightapi,
//     };
//   } catch (error) {
//     console.error("Error fetching content:", error);
//     return {
//       leftapi: [],
//       rightapi: [],
//     };
//   }
// }

// Lấy danh mục trái phải mới
export async function getContent() {
  try {
    const contentApi = await axios.get(`https://demodienmay.125.atoz.vn/ww2/web.vitritrai.asp`);

    const data = contentApi.data;

    // Chỉ lấy danh mục ở phần `tenham === 'danhmucmenu'`
    const menuBlock = Array.isArray(data)
      ? data.find((item: any) => item.tenham === "danhmucmenu")
      : null;

    const leftapi: ContentApi[] = menuBlock?.noidung ?? [];

    return {
      leftapi,
      rightapi: [], // nếu có thêm block 'phải', xử lý tương tự
    };
  } catch (error) {
    console.error("Error fetching content:", error);
    return {
      leftapi: [],
      rightapi: [],
    };
  }
}


// lấy danh sách sản phẩm
export async function getProductAPI({ id }: { id: string }) {
  const res = await axios.get(`${apiUrl}/content/get-product?id=${id}`);
  const product: NewApiResponse[] = res.data.product;
  return { id, product };
}

//lấy sản phẩm chi tiết
export async function getProductDetailApi({ id }: { id: number }) {
  const res = await axios.get(`${apiUrl}/content/get-product-detail`, {
    params: { id },
  });
  const product: ProductDetail[] = res.data.product;
  const related: ProductRelated = res.data.relatedProduct;
  return { product, related };
}

export async function getNewsDetailApi({ id }: { id: string }) {
  const res = await axios.get(`${apiUrl}/content/get-news-detail`, {
    params: { id },
  });
  const newsDetail: NewsDetail = res.data.newsDetail;
  const newsRelated: NewsRelatedType = res.data.newsRelated;
  // const related: ProductRelated = res.data.relatedProduct;
  return { newsDetail, newsRelated };
}
//lấy danh sách tin tức
// export async function getNewsApi({
//   id,
//   page,
//   sl,
// }: {
//   id: string;
//   sl: number;
//   page: number;
// }) {
//   const res = await axios.get(`https://demodienmay.125.atoz.vn/ww2/module.tintuc.trangchu.asp?id=35139`, {
//     params: { id, sl, page },
//   });

//   const news: News[] = res.data.news;

//   return {
//     id: id,
//     news: news,
//   };
// }

//lấy danh sách tin tức mới
export async function getNewsApi({ id }: { id: string }) {
  const res = await axios.get(`https://demodienmay.125.atoz.vn/ww2/module.tintuc.trangchu.asp?id=35139`, {
    params: { id },
  });

  const news: News[] = res.data;

  return {
    id: id,
    news: news,
  };
}
//add to wishlist
export async function ProductActionAddWishlist({
  ProductID,
  Image,
  Price,
  Title,
}: {
  ProductID: string;
  Image: string;
  Price: number;
  Title: string;
}) {
  // kiểm tra sessionStorage
  const savedWishlist: {
    ProductID: string;
    Image: string;
    Price: number;
    Title: string;
  }[] = JSON.parse(sessionStorage.getItem("wishlist") || "[]");

  //tạo object mới
  const newWishlist = {
    ProductID,
    Price,
    Image,
    Title,
  };
  const existing = savedWishlist.find(
    (wl) => wl.ProductID === newWishlist.ProductID
  );
  if (existing) {
    return "Đã có sản phẩm này trong yêu thích";
  }
  //add object
  savedWishlist.push(newWishlist);
  //save new wishlist
  sessionStorage.setItem("wishlist", JSON.stringify(savedWishlist));
  return "Thêm vào yêu thích thành công!";
}
//post sản phẩm vào cart
export async function ProductActionAddToCart({
  img,
  product_id,
  product_name,
  price,
  email,
  quantity,
}: {
  img: string;
  product_id: string;
  product_name: string;
  price: string;
  email: string;
  quantity: number;
}) {
  const res = await axios.post(`${apiUrl}/content/save-cart`, {
    img,
    product_id,
    product_name,
    price,
    email,
    quantity,
  });
  const data: string = res.data.result.message;
  return data;
}
//lấy danh sách yêu thích và giỏ hàng
export async function getCartFormApi({ email }: { email: string }) {
  const res = await axios.get(`${apiUrl}/content/get-cart`, {
    params: { email },
  });
  const data = res.data;

  return data;
}

export async function getWishListFormSession() {
  const savedWishlist: {
    ProductID: string;
    Image: string;
    Price: number;
    Title: string;
  }[] = JSON.parse(sessionStorage.getItem("wishlist") || "[]");
  return savedWishlist;
}
//oder sản phẩm
export async function oderAction({
  tel,
  customer_name,
  email,
  address,
  note,
  product_price,
  total_price,
  items,
  pay_method,
}: {
  customer_name: string | undefined | false;
  tel: string | undefined | false;
  email: string;
  product_price: number;
  address: string | false | undefined;
  note: string;
  pay_method: string;
  total_price: number;
  items: { idpart: number; quantity: number; price: number }[];
}) {
  const res = await axios.post(`${apiUrl}/content/oder`, {
    customer_name,
    tel,
    email,
    address,
    product_price,
    note,
    total_price,
    pay_method,
    items,
  });
  const data: string = res.data.mess;
  const link: CheckoutPayload = res.data.link;
  const order_id: string = res.data.order_id;
  return { data, link, order_id };
}
//lấy form liên hệ
export async function getContactPageContentApi({ id }: { id: string }) {
  const api = await axios.get(`${apiUrl}/content/get-contact-form`, {
    params: { id },
  });
  const data: ContactApi[] = api.data.contact;
  return data;
}
export interface VietNameAddressInterface {
  name: string;
  code: number;
  division_type: string;
  phone_code: number;
  codename: string;
  districts: DistrictsInterface[] | [];
}

interface DistrictsInterface {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  province_code: number;
  wards: WardsInterface[] | [];
}
interface WardsInterface {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
}
export const fetchVietNameAddress = async () => {
  try {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/?depth=3`
    );
    const data: VietNameAddressInterface[] = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error);
    }
    return null;
  }
};

export async function checkPayment(paymentLinkId: string) {
  try {
    const res = await axios.post(`${apiUrl}/checkout/receive-hook`, {
      checkIP: paymentLinkId,
    });
    const data = res.data;
    return data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error);
    }
    return "failed";
  }
}

export async function cancelCheckout({
  orderCode,
  email,
  order_id,
}: {
  email: string;
  orderCode: string;
  order_id: string;
}) {
  try {
    const res = await axios.post(`${apiUrl}/checkout/cancel-payment`, {
      orderCode,
      order_id,
      email,
    });
    const result: string = res.data.result;
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error);
    }
    return "failed";
  }
}

export interface Order {
  id: string;
  customer_name: string;
  email: string;
  tel: string;
  address: string;
  status: string;
  note: string;
  total_price: string;
  date: string;
  items: Item[];
}

export interface Item {
  id: string;
  quantity: string;
  price: string;
  name: string;
  image: string;
}

export async function getOderFunction({ email }: { email: string }) {
  const res = await axios.get(`${apiUrl}/content/get-order?email=${email}`);
  const data: Order[] = res.data.orders;
  return data;
}

export async function updateCartQuantity({
  product_id,
  email,
  quantity,
}: {
  product_id: string;
  email: string;
  quantity: number;
}) {
  const res = await axios.put(`${apiUrl}/content/update-cart`, {
    product_id,
    email,
    quantity,
  });
  return res.data.message;
}

export async function removeCartApi({
  product_id,
  email,
}: {
  product_id: string;
  email: string;
}) {
  const res = await axios.put(`${apiUrl}/content/remove-cart`, {
    product_id,
    email,
  });
  return res.data.message;
}

export async function removeOrder(email: string, order_id: string) {
  try {
    await axios.post(`http://localhost:8000/api/cancel.order.php`, {
      IDBG: order_id,
      email: email,
    });
    window.location.reload();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return "Lỗi axios";
    }
  }
}




// ================================== Cart mới ==================================
// Kiểm tra cookie còn hạn không (có logging)
export function isCookieExpired(): boolean {
  const expireDate = localStorage.getItem('DathangMabaogia_expire');
  if (!expireDate) {
    console.log('❌ Không có expire date');
    return true;
  }
  const now = new Date();
  const expire = new Date(expireDate);
  const isExpired = now > expire;
  // console.log('🕐 Now:', now.toISOString(), '| Expire:', expire.toISOString(), '| Expired?', isExpired);
  return isExpired;
}

// Helper function để validate và clean cookie values
export function validateCookieValue(cookieValue: any): string | null {
  if (!cookieValue) return null;

  // Nếu là object, chuyển thành string nhưng log warning
  if (typeof cookieValue === 'object') {
    console.warn('⚠️ Cookie value là object, có thể có lỗi:', cookieValue);
    return null; // Không lưu object cookie
  }

  const stringValue = String(cookieValue).trim();

  // Kiểm tra nếu là "[object Object]" hoặc các giá trị không hợp lệ khác
  if (stringValue === '[object Object]' ||
    stringValue === 'undefined' ||
    stringValue === 'null' ||
    stringValue.includes('[object')) {
    console.warn('⚠️ Cookie value không hợp lệ:', stringValue);
    return null;
  }

  return stringValue;
}

// Interface cho add to cart response
export interface AddToCartResponse {
  sl: number;
  tongtien: number;
  thongbao: string;
}

// Interface cho giỏ hàng hiện tại (cập nhật để hiển thị hình ảnh đầy đủ)
export interface CartItem {
  id: string;
  partCode: string;
  productCode: string;
  partName: string;
  image: string; // Đây sẽ là đường dẫn tương đối từ API
  fullImageUrl?: string; // Đường dẫn đầy đủ sau khi gắn domain
  note: string;
  quantity: number;
  price: number;
  unit: string;
  hasNewTab: boolean;
  giftProducts: unknown[];
}

export interface CurrentCart {
  items: CartItem[];
  totalAmount: number;
}

// Lấy cookie DathangMabaogia (có logging mạnh)
export async function getCartCookie(): Promise<string> {
  try {
    // console.log('🚀 getCartCookie() được gọi');
    const existingCookie = localStorage.getItem('DathangMabaogia');
    const expireDate = localStorage.getItem('DathangMabaogia_expire');
    // console.log('📦 Cookie từ localStorage:', existingCookie);
    // console.log('⏰ Expire date:', expireDate);

    if (existingCookie && !isCookieExpired()) {
      // console.log('🍪 Sử dụng cookie có sẵn:', existingCookie);
      return existingCookie;
    }

    // Nếu chưa có hoặc hết hạn, gọi API lấy cookie mới
    // console.log('🌐 Gọi API để tạo cookie mới...');
    const response = await axios.get('https://demodienmay.125.atoz.vn/ww1/cookie.mabaogia.asp');
    // console.log('🔥 Cookie API response:', response.data);

    // Xử lý response - có thể là array hoặc object
    let cookieData;
    if (Array.isArray(response.data) && response.data.length > 0) {
      cookieData = response.data[0];
    } else if (typeof response.data === 'object') {
      cookieData = response.data;
    }

    // console.log('🔥 Processed cookie data:', cookieData);

    if (cookieData && cookieData.DathangMabaogia) {
      const cookieValue = validateCookieValue(cookieData.DathangMabaogia);

      if (cookieValue) {
        const expire = new Date();
        expire.setDate(expire.getDate() + 365);
        localStorage.setItem('DathangMabaogia', cookieValue);
        localStorage.setItem('DathangMabaogia_expire', expire.toISOString());
        // console.log('✅ Cookie đã được lưu:', cookieValue, 'HSD:', expire.toISOString());
        return cookieValue;
      } else {
        throw new Error('Cookie value không hợp lệ');
      }
    }
    throw new Error('Không thể lấy cookie - không tìm thấy DathangMabaogia trong response');
  } catch (error) {
    console.error('❌ Error getting cart cookie:', error);
    throw error;
  }
}

// Helper function để tạo URL hình ảnh đầy đủ
export function getFullImageUrl(relativePath: string): string {
  if (!relativePath) return '/placeholder-image.png'; // Trả về placeholder nếu không có ảnh

  // Nếu đã có domain đầy đủ, trả về nguyên
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  // Nếu bắt đầu bằng /, bỏ dấu / đầu
  const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;

  // Xử lý các trường hợp đặc biệt
  if (cleanPath.startsWith('mediaroot/')) {
    // Nếu path bắt đầu với mediaroot, chuyển thành đường dẫn đúng
    return `https://demodienmay.125.atoz.vn/${cleanPath}`;
  }

  if (cleanPath.startsWith('storage/')) {
    // Nếu path bắt đầu với storage, có thể cần điều chỉnh
    return `https://demodienmay.125.atoz.vn/${cleanPath}`;
  }

  // Gắn domain đầy đủ cho các trường hợp khác
  return `https://demodienmay.125.atoz.vn/${cleanPath}`;
}

// Lấy giỏ hàng hiện tại (PHẢI truyền cookie qua query param)
export async function getCurrentCart(): Promise<CurrentCart> {
  try {
    // console.log('🛒 getCurrentCart() được gọi');
    const cookieValue = await getCartCookie();
    // console.log('🍪 Cookie dùng để lấy giỏ hàng:', cookieValue);

    const apiUrl = `https://demodienmay.125.atoz.vn/ww1/giohanghientai.asp?id=${cookieValue}`;
    // console.log('🔗 API URL:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    // console.log('✅ Response giỏ hàng:', response.data);

    // Xử lý response để gắn URL hình ảnh đầy đủ
    if (response.data && response.data.items && Array.isArray(response.data.items)) {
      const processedCart: CurrentCart = {
        ...response.data,
        items: response.data.items.map((item: CartItem) => ({
          ...item,
          fullImageUrl: getFullImageUrl(item.image)
        }))
      };

      // console.log('🖼️ Processed cart with full image URLs:', processedCart);
      return processedCart;
    }

    // Fallback cho trường hợp response không có structure mong đợi
    // console.log('⚠️ Response không có items array, trả về giỏ hàng trống');
    return { items: [], totalAmount: 0 };

  } catch (error) {
    console.error('❌ Error getting current cart:', error);

    // Trả về giỏ hàng trống khi có lỗi
    return { items: [], totalAmount: 0 };
  }
}

// Thêm sản phẩm vào giỏ hàng (chưa đăng nhập) - logging mạnh
export async function addToCartGuest(productId: string): Promise<AddToCartResponse> {
  try {
    // console.log('🛒 addToCartGuest() được gọi với productId:', productId);
    const cookieValue = await getCartCookie();
    // console.log('🍪 Cookie Value:', cookieValue);

    const apiUrl = `https://demodienmay.125.atoz.vn/ww1/addgiohang.asp?IDPart=${productId}&id=${cookieValue}`;
    // console.log('🚀 API thêm vào giỏ hàng:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    // console.log('✅ Response từ API:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    throw error;
  }
}

// Xóa cookie hết hạn (có logging)
export function clearExpiredCookie(): void {
  if (isCookieExpired()) {
    // console.log('🗑️ Xóa cookie hết hạn');
    localStorage.removeItem('DathangMabaogia');
    localStorage.removeItem('DathangMabaogia_expire');
  }
}

// ================================== Wishlist mới ==================================
export interface CurrentWishlist {
  items: WishlistItem[];
  totalAmount: number;
}

export interface WishlistItem {
  id: string;
  partCode: string;
  productCode: string;
  partName: string;
  image: string;
  note: string;
  quantity: number;
  price: number;
  unit: string;
  hasNewTab: string;
  giftProducts: any[];
  fullImageUrl?: string;
}

export interface AddToWishlistResponse {
  sl: number;
  thongbao: string;
}

export interface CookieWishlistResponse {
  DathangMabaogia?: string;
  WishlistMabaogia?: string;
}

// Lấy cookie WishlistMabaogia (tương tự DathangMabaogia)
export async function getWishlistCookie(): Promise<string> {
  try {
    // console.log('🚀 getWishlistCookie() được gọi');
    const existingCookie = localStorage.getItem('WishlistMabaogia');
    const expireDate = localStorage.getItem('WishlistMabaogia_expire');
    // console.log('📦 Wishlist Cookie từ localStorage:', existingCookie);
    // console.log('⏰ Wishlist Expire date:', expireDate);

    if (existingCookie && !isWishlistCookieExpired()) {
      // console.log('🍪 Sử dụng wishlist cookie có sẵn:', existingCookie);
      return existingCookie;
    }

    // Nếu chưa có hoặc hết hạn, gọi API lấy cookie mới
    // console.log('🌐 Gọi API để tạo wishlist cookie mới...');
    const response = await axios.get('https://demodienmay.125.atoz.vn/ww1/cookie.mabaogia.asp');
    // console.log('🔥 Wishlist Cookie API response:', response.data);

    // Xử lý response - có thể là array hoặc object
    let cookieData;
    if (Array.isArray(response.data) && response.data.length > 0) {
      cookieData = response.data[0];
    } else if (typeof response.data === 'object') {
      cookieData = response.data;
    }

    // console.log('🔥 Processed wishlist cookie data:', cookieData);

    if (cookieData) {
      // Thử lấy WishlistMabaogia trước, nếu không có thì dùng DathangMabaogia
      const rawCookieValue = cookieData.WishlistMabaogia || cookieData.DathangMabaogia;
      const cookieValue = validateCookieValue(rawCookieValue);

      if (cookieValue) {
        const expire = new Date();
        expire.setDate(expire.getDate() + 365);
        localStorage.setItem('WishlistMabaogia', cookieValue);
        localStorage.setItem('WishlistMabaogia_expire', expire.toISOString());
        // console.log('✅ Wishlist Cookie đã được lưu:', cookieValue, 'HSD:', expire.toISOString());
        return cookieValue;
      } else {
        throw new Error('Wishlist cookie value không hợp lệ');
      }
    }
    throw new Error('Không thể lấy wishlist cookie - không tìm thấy cookie value trong response');
  } catch (error) {
    console.error('❌ Error getting wishlist cookie:', error);
    throw error;
  }
}

// Lấy wishlist hiện tại
export async function getCurrentWishlist(): Promise<CurrentWishlist> {
  try {
    // console.log('❤️ getCurrentWishlist() được gọi');
    const cookieValue = await getWishlistCookie();
    // console.log('🍪 Wishlist Cookie dùng để lấy wishlist:', cookieValue);

    const apiUrl = `https://demodienmay.125.atoz.vn/ww1/wishlisthientai.asp?id=${cookieValue}`;
    // console.log('🔗 Wishlist API URL:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    // console.log('✅ Response wishlist:', response.data);

    // Xử lý response để gắn URL hình ảnh đầy đủ
    if (response.data && response.data.items && Array.isArray(response.data.items)) {
      const processedWishlist: CurrentWishlist = {
        ...response.data,
        items: response.data.items.map((item: WishlistItem) => ({
          ...item,
          fullImageUrl: getFullImageUrl(item.image)
        }))
      };

      // console.log('🖼️ Processed wishlist with full image URLs:', processedWishlist);
      return processedWishlist;
    }

    // Fallback cho trường hợp response không có structure mong đợi
    // console.log('⚠️ Response không có items array, trả về wishlist trống');
    return { items: [], totalAmount: 0 };

  } catch (error) {
    console.error('❌ Error getting current wishlist:', error);

    // Trả về wishlist trống khi có lỗi
    return { items: [], totalAmount: 0 };
  }
}

// Thêm sản phẩm vào wishlist (chưa đăng nhập)
export async function addToWishlistGuest(productId: string): Promise<AddToWishlistResponse> {
  try {
    // console.log('❤️ addToWishlistGuest() được gọi với productId:', productId);
    const cookieValue = await getWishlistCookie();
    // console.log('🍪 Wishlist Cookie Value:', cookieValue);

    const apiUrl = `https://demodienmay.125.atoz.vn/ww1/addwishlist.asp?IDPart=${productId}&id=${cookieValue}`;
    // console.log('🚀 API thêm vào wishlist:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    // console.log('✅ Response từ API wishlist:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error adding to wishlist:', error);
    throw error;
  }
}

// Kiểm tra wishlist cookie còn hạn không
export function isWishlistCookieExpired(): boolean {
  const expireDate = localStorage.getItem('WishlistMabaogia_expire');
  if (!expireDate) {
    // console.log('❌ Không có wishlist expire date');
    return true;
  }
  const now = new Date();
  const expire = new Date(expireDate);
  const isExpired = now > expire;
  // console.log('🕐 Wishlist Now:', now.toISOString(), '| Expire:', expire.toISOString(), '| Expired?', isExpired);
  return isExpired;
}

// Xóa wishlist cookie hết hạn
export function clearExpiredWishlistCookie(): void {
  if (isWishlistCookieExpired()) {
    // console.log('🗑️ Xóa wishlist cookie hết hạn');
    localStorage.removeItem('WishlistMabaogia');
    localStorage.removeItem('WishlistMabaogia_expire');
  }
}