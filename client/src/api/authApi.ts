import { CheckLoginState } from "@/types/authType";
import axios from "axios";

// Sử dụng biến môi trường - http://localhost:8080/api
// const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiUrl = "https://demodienmay.125.atoz.vn/ww1/userlogin.asp"; // hardcode tạm thời

//========================== Login ==========================
export async function loginFunction({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    // Tạo URL với query parameters
    const params = new URLSearchParams({
      userid: email,
      pass: password,
    })

    // Tạo URL hoàn chỉnh với tham số
    const fullUrl = `${apiUrl}?${params.toString()}`;

    // Gửi yêu cầu GET đến API
    const res = await axios.get(fullUrl);

    // Api trả về mảng, lấy phần tử đầu tiên
    const data = res.data[0];

    // Kiểm tra đăng nhập thành công
    if (data.maloi === "1") {
      return {
        resultCode: 1,
        message: data.ThongBao,
        userData: {
          memberid: data.memberid,
          user: data.user,
          chucnang: data.chucnang,
          email: email
        }
      };
    } else {
      // Đăng nhập thất bại
      return {
        resultCode: 0,
        message: data.ThongBao,
        userData: null
      };
    }

  } catch (error) {
    console.error("🔥 Login API Error:", error);

    return {
      resultCode: 0,
      message: "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.",
      userData: null
    };
  }

  // const response = await axios.post(
  //   `${apiUrl}/auth/login`,
  //   {
  //     email,
  //     password,
  //   },
  //   { withCredentials: true }
  // );
  // const data: { mess: string; resultCode: number } = response.data;
  // const result = data.resultCode;
  // return result;
}

//check login
export async function checkLogin(): Promise<CheckLoginState> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(`${apiUrl}/auth/check-login`, {
      withCredentials: true,
    });
    const data: CheckLoginState = response.data;
    return data;
  } catch (error) {
    // Nếu là lỗi 401, trả về response cho biết chưa đăng nhập
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return {
        mess: "Chưa đăng nhập",
        usersData: {
          id: "",
          userId: "",
          email: "",
          name: "",
          phone: "",
          userCode: "",
          avt: "",
          birthday: "",
          gender: "",
          address: "",
        },
        resultCode: 0
      };
    }
    // Chỉ log lỗi thật sự (không phải 401)
    console.error("🔥 [Auth API] checkLogin error:", error);
    throw error;
  }

  // const response = await axios.get(`${apiUrl}/auth/check-login`, {
  //   withCredentials: true,
  // });
  // const data: CheckLoginState = response.data;

  // return data;
}

//========================== Register ==========================
export interface FormDataRegister {
  email: string;
  tel: string;
  password: string;
  name: string;
  username: string;
}
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    CustomerID: string;
    CustomerName: string;
    CustomerUsername: string;
    MaKH: string;
  };
}

// handling register
export async function registerFunction({
  email,
  tel,
  password,
  name,
  username
}: FormDataRegister) {
  try {
    // Tạo URL với query parameters
    const params = new URLSearchParams({
      id2: "Chophepdangky",
      loaithanhvien: "1",
      tenkh: name,
      email: email,
      tel: tel,
      userid: username,
      pass: password,
    })

    // Tạo URL hoàn chỉnh với tham số
    const fullUrl = `${apiUrl}?${params.toString()}`;

    // Gửi yêu cầu GET đến API
    const res = await axios.get(fullUrl);

    // Xử lý phản hồi từ API
    const resText = res.data;
    const isSuccess = res.status === 200 && !resText.includes("error") && !resText.includes("Error");

    // Trả về kết quả đăng ký
    const result: RegisterResponse = {
      success: isSuccess,
      message: isSuccess ? "Đăng ký thành công" : "Đăng ký thất bại",
      data: {
        CustomerID: username,
        CustomerName: name,
        CustomerUsername: username,
        MaKH: username,
      },
    }

    return result;
  }
  catch (error: unknown) {
    // Xử lý lỗi
    console.error("Register API Error:", error);
    const result: RegisterResponse = {
      success: false,
      message: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.",
      data: {
        CustomerID: "",
        CustomerName: "",
        CustomerUsername: "",
        MaKH: "",
      },
    };

    return result;
  }

  // const res = await axios.post(`${apiUrl}/auth/register`, {
  //   email,
  //   tel,
  //   password,
  //   name,
  //   username
  // });
  // const result: RegisterResponse = res.data.result;
  // return result;
}

// ====================== Handling logout ======================
export async function handleLogout() {
  await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
}


// ====================== Cart Functions ======================
// Function to get DathangMabaogia cookie from API
export async function getDathangMabaogiaCookie(preserveExisting: boolean = false) {
  try {
    // Nếu preserveExisting = true và đã có DathangMabaogia, không tạo mới
    if (preserveExisting) {
      const existingDathang = localStorage.getItem('DathangMabaogia');
      if (existingDathang) {
        console.log("🔥 [getDathangMabaogiaCookie] Preserving existing DathangMabaogia:", existingDathang);
        return existingDathang;
      }
    }

    console.log("🔥 [getDathangMabaogiaCookie] Calling cookie API...");

    const response = await axios.get('https://demodienmay.125.atoz.vn/ww1/cookie.mabaogia.asp');
    console.log("🔥 [getDathangMabaogiaCookie] Cookie API response:", response.data);

    // Xử lý response - có thể là array hoặc object
    let dathangData;
    if (Array.isArray(response.data) && response.data.length > 0) {
      dathangData = response.data[0];
    } else if (typeof response.data === 'object') {
      dathangData = response.data;
    }

    console.log("🔥 [getDathangMabaogiaCookie] Processed data:", dathangData);

    const dathangValue = dathangData?.DathangMabaogia;

    if (dathangValue) {
      // Đảm bảo là string
      const dathangString = typeof dathangValue === 'string' ? dathangValue : String(dathangValue);

      // Lưu vào localStorage
      localStorage.setItem('DathangMabaogia', dathangString);
      console.log("🔥 [getDathangMabaogiaCookie] Saved DathangMabaogia to localStorage:", dathangString);

      // Set cookie với thời hạn 365 ngày
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 365);
      document.cookie = `DathangMabaogia=${dathangString}; path=/; expires=${expiryDate.toUTCString()}`;
      console.log("🔥 [getDathangMabaogiaCookie] Set DathangMabaogia cookie:", dathangString);

      return dathangString;
    }

    return null;
  } catch (error) {
    console.error("🔥 [getDathangMabaogiaCookie] Error:", error);
    return null;
  }
}

// Function to get ASP session cookie from current session
function getAspSessionCookie(): { name: string; value: string } | null {
  // Lấy từ localStorage nếu có
  const storedSessionName = localStorage.getItem('aspSessionName');
  const storedSessionValue = localStorage.getItem('aspSessionValue');

  if (storedSessionName && storedSessionValue) {
    return { name: storedSessionName, value: storedSessionValue };
  }

  // Lấy từ cookie hiện tại - tìm cookie bắt đầu với ASPSESSIONID
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name.startsWith('ASPSESSIONID')) {
      // Lưu vào localStorage để sử dụng lần sau
      localStorage.setItem('aspSessionName', name);
      localStorage.setItem('aspSessionValue', value);
      return { name, value };
    }
  }

  return null;
}

// Remove item from cart - Using Next.js API Route as proxy
export async function removeFromCart(idpart: string) {
  console.log("🔥 [removeFromCart] Function called with idpart:", idpart);

  try {
    // Hiển thị cookies hiện tại
    console.log("🔥 [removeFromCart] Current browser cookies:", document.cookie);

    // Lấy ASP session từ localStorage hoặc cookies
    const aspSession = getAspSessionCookie();
    console.log("🔥 [removeFromCart] ASP Session found:", aspSession);

    // Kiểm tra localStorage cho DathangMabaogia
    let dathangMabaogia = localStorage.getItem('DathangMabaogia');

    // Nếu chưa có DathangMabaogia, gọi API để lấy
    if (!dathangMabaogia) {
      console.log("🔥 [removeFromCart] DathangMabaogia not found, fetching from API...");
      dathangMabaogia = await getDathangMabaogiaCookie();
    }

    console.log("🔥 [removeFromCart] DathangMabaogia value:", dathangMabaogia);

    // Chuẩn bị data để gửi đến API Route
    const requestData = {
      idpart: idpart,
      aspSession: aspSession,
      dathangMabaogia: dathangMabaogia || '637'
    };

    console.log("🔥 [removeFromCart] Sending data to API Route:", requestData);

    // Gọi Next.js API Route
    const response = await fetch('/api/cart/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(requestData)
    });

    console.log("🔥 [removeFromCart] API Route response status:", response.status);

    const result = await response.json();
    console.log("🔥 [removeFromCart] API Route result:", result);

    return {
      success: result.success,
      message: result.message || "API call completed",
      data: result.data
    };

  } catch (error: unknown) {
    console.error("🔥 [removeFromCart] Error occurred:", error);

    return {
      success: false,
      message: "Có lỗi xảy ra khi xóa sản phẩm: " + (error instanceof Error ? error.message : String(error)),
      data: null
    };
  }
}

// ==================== WISHLIST FUNCTIONS ====================

// Function to get WishlistMabaogia cookie from API
export async function getWishlistMabaogiaCookie(preserveExisting: boolean = false) {
  try {
    // Nếu preserveExisting = true và đã có WishlistMabaogia, không tạo mới
    if (preserveExisting) {
      const existingWishlist = localStorage.getItem('WishlistMabaogia');
      if (existingWishlist) {
        console.log("❤️ [getWishlistMabaogiayCookie] Preserving existing WishlistMabaogia:", existingWishlist);
        return existingWishlist;
      }
    }

    console.log("❤️ [getWishlistMabaogiayCookie] Calling cookie API...");

    const response = await axios.get('https://demodienmay.125.atoz.vn/ww1/cookie.mabaogia.asp');
    console.log("❤️ [getWishlistMabaogiayCookie] Cookie API response:", response.data);

    // Xử lý response - có thể là array hoặc object
    let wishlistData;
    if (Array.isArray(response.data) && response.data.length > 0) {
      wishlistData = response.data[0];
    } else if (typeof response.data === 'object') {
      wishlistData = response.data;
    }

    console.log("❤️ [getWishlistMabaogiayCookie] Processed data:", wishlistData);

    // Lấy WishlistMabaogia từ phần tử đầu tiên hoặc dùng DathangMabaogia làm fallback
    const wishlistValue = wishlistData?.WishlistMabaogia || wishlistData?.DathangMabaogia;

    if (wishlistValue) {
      // Đảm bảo là string
      const wishlistString = typeof wishlistValue === 'string' ? wishlistValue : String(wishlistValue);

      // Lưu vào localStorage
      localStorage.setItem('WishlistMabaogia', wishlistString);
      console.log("❤️ [getWishlistMabaogiayCookie] Saved WishlistMabaogia to localStorage:", wishlistString);

      // Set cookie với thời hạn 365 ngày
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 365);
      document.cookie = `WishlistMabaogia=${wishlistString}; path=/; expires=${expiryDate.toUTCString()}`;
      console.log("❤️ [getWishlistMabaogiayCookie] Set WishlistMabaogia cookie:", wishlistString);

      return wishlistString;
    }

    return null;
  } catch (error) {
    console.error("❤️ [getWishlistMabaogiayCookie] Error:", error);
    return null;
  }
}

// Remove from wishlist function
export async function removeFromWishlist(idpart: string) {
  console.log("❤️ [removeFromWishlist] Function called with idpart:", idpart);

  try {
    console.log("❤️ [removeFromWishlist] Current browser cookies:", document.cookie);

    // Get ASP Session từ localStorage hoặc cookie hiện tại
    const aspSession = getAspSessionCookie();
    console.log("❤️ [removeFromWishlist] ASP Session found:", aspSession);

    // Get WishlistMabaogia từ localStorage
    let wishlistMabaogia = localStorage.getItem('WishlistMabaogia');
    if (!wishlistMabaogia) {
      console.log("❤️ [removeFromWishlist] WishlistMabaogia not found, fetching from API...");
      wishlistMabaogia = await getWishlistMabaogiaCookie();
    }
    console.log("❤️ [removeFromWishlist] WishlistMabaogia value:", wishlistMabaogia);

    // Prepare data for API Route
    const requestData = {
      idpart,
      aspSession,
      wishlistMabaogia
    };

    console.log("❤️ [removeFromWishlist] Sending data to API Route:", requestData);

    // Gọi Next.js API Route
    const response = await fetch('/api/wishlist/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(requestData)
    });

    console.log("❤️ [removeFromWishlist] API Route response status:", response.status);

    const result = await response.json();
    console.log("❤️ [removeFromWishlist] API Route result:", result);

    return {
      success: result.success,
      data: result.body
    };

  } catch (error) {
    console.error("❤️ [removeFromWishlist] Error occurred:", error);
    throw error;
  }
}
