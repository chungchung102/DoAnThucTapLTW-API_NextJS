// import { initialState } from "@/types/authType";
// import { createSlice } from "@reduxjs/toolkit";
// import { checkAuth, login, register } from "../api/reduxAuthApi";

// // ------------------------ Slice ------------------------

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Kiểm tra đăng nhập
//       .addCase(checkAuth.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.loggedIn = true;
//         state.users = action.payload.usersData;
//         state.loading = false;
//       })
//       .addCase(checkAuth.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Đăng nhập
//       .addCase(login.pending, (state) => { // Bắt đầu đăng nhập
//         state.loading = true;
//       })
//       .addCase(login.fulfilled, (state, action) => { // Cập nhật state khi đăng nhập thành công
//         state.loading = false;
//         state.resultCode = action.payload.resultCode; // Cập nhật resultCode từ payload
//         state.loginMessage = action.payload.message; // Cập nhật message từ payload

//         // Kiểm tra resultCode nếu thành công thì cập nhật loggedIn
//         if (action.payload.resultCode === 1) {
//           state.loggedIn = true;

//           if (action.payload.userData) {
//             const userData = {
//               id: action.payload.userData.memberid,
//               userId: action.payload.userData.user,
//               email: action.payload.userData.email,
//               name: action.payload.userData.user,
//               phone: "",
//               userCode: action.payload.userData.memberid,
//               avt: "",
//               birthday: "",
//               gender: "",
//               address: "",
//             };
//             state.users = userData;

//             // Lưu trạng thái đăng nhập vào localStorage
//             if (typeof window !== 'undefined') { // Kiểm tra nếu đang ở môi trường trình duyệt
//               localStorage.setItem('userInfo', JSON.stringify(userData)); // Lưu thông tin user
//               localStorage.setItem('isLoggedIn', 'true'); // Lưu trạng thái đăng nhập
//             }
//           }
//         }
//         else {
//           state.loggedIn = false; // Đăng nhập thất bại
//         }
//       })
//       .addCase(login.rejected, (state) => { // Cập nhật state khi đăng nhập thất bại
//         state.loading = false;
//         state.resultCode = 0;
//         state.error = "Lỗi đăng nhập";
//         state.loginMessage = "Đăng nhập thất bại";
//       })


//       // register
//       .addCase(register.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.loading = false;
//         state.registerResponse = action.payload;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.error = action.payload ?? "Lỗi đăng ký";
//         state.loading = false;
//       });
//   },
// });

// export default authSlice.reducer;


import { initialState } from "@/types/authType";
import { createSlice } from "@reduxjs/toolkit";
import { checkAuth, login, register } from "../api/reduxAuthApi";

// ------------------------ Slice ------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.loggedIn = false;
      state.users = null;
      state.resultCode = null;
      state.loginMessage = null;

      // Xóa dữ liệu khỏi localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('isLoggedIn');
      }
    },
    loadUserFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userInfo = localStorage.getItem('userInfo');

        console.log('🔍 [Auth Slice] Loading from storage:', { isLoggedIn, userInfo });

        if (isLoggedIn === 'true' && userInfo) {
          try {
            const parsedUser = JSON.parse(userInfo);
            state.users = parsedUser;
            state.loggedIn = true;
            console.log('✅ [Auth Slice] User loaded from storage:', parsedUser);
          } catch (error) {
            console.error('Error parsing user info from localStorage:', error);
            localStorage.removeItem('userInfo');
            localStorage.removeItem('isLoggedIn');
          }
        } else {
          console.log('❌ [Auth Slice] No valid data in storage');
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Kiểm tra đăng nhập
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loggedIn = true;
        state.loading = false;

        // Xử lý user data từ checkAuth response
        if (action.payload.usersData) {
          state.users = action.payload.usersData;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.loggedIn = false;

        // Chỉ set error nếu không phải trường hợp "not_logged_in"
        if (action.payload !== "not_logged_in") {
          state.error = action.payload as string;
        }
      })

      // Đăng nhập
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.resultCode = action.payload.resultCode;
        state.loginMessage = action.payload.message;

        if (action.payload.resultCode === 1) {
          state.loggedIn = true;
          // Lưu user data vào state với cấu trúc phù hợp
          if (action.payload.userData) {
            const userData = {
              id: action.payload.userData.memberid,
              userId: action.payload.userData.user,
              email: action.payload.userData.email,
              name: action.payload.userData.user,
              phone: "",
              userCode: action.payload.userData.memberid,
              avt: "",
              birthday: "",
              gender: "",
              address: "",
            };
            state.users = userData;

            // Lưu vào localStorage để persist qua reload
            if (typeof window !== 'undefined') {
              localStorage.setItem('userInfo', JSON.stringify(userData));
              localStorage.setItem('isLoggedIn', 'true');
              console.log('💾 [Auth Slice] Saved to localStorage:', userData);
            }
          }
        } else {
          state.loggedIn = false;
        }
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.resultCode = 0;
        state.error = "Lỗi đăng nhập";
        state.loginMessage = "Đăng nhập thất bại";
      })

      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.registerResponse = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload ?? "Lỗi đăng ký";
        state.loading = false;
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;