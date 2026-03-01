E-Commerce Website – Next.js Frontend
📌 Giới thiệu

Đây là frontend của hệ thống website thương mại điện tử, được xây dựng bằng Next.js (React Framework).
Dự án sử dụng Next.js để xây dựng giao diện người dùng hiện đại, hỗ trợ render phía server (SSR) giúp tăng hiệu năng và tối ưu SEO.

Project là một phần của hệ thống full-stack gồm:

Client: Next.js (Frontend)

Server: Node.js (Backend API)

Admin: Laravel (Trang quản trị)

🛠 Công nghệ sử dụng

Next.js 15

React 19

Bootstrap 5

Redux Toolkit / React Redux

Font Awesome

TypeScript (types cho React)

📂 Cấu trúc thư mục (Frontend – Next.js)
client/
├── app/                # App Router (Next.js 13+)
│   ├── layout.tsx      # Layout dùng chung toàn bộ website
│   ├── page.tsx        # Trang chủ (route "/")
│   └── ...             # Các route khác
│
├── public/             # File tĩnh (ảnh, favicon, logo...)
├── styles/             # CSS / SCSS / Bootstrap
├── components/         # Các component tái sử dụng (Header, Footer...)
├── store/              # Redux store (nếu có)
├── package.json        # Khai báo thư viện và script
└── next.config.js      # Cấu hình Next.js
🔄 Cách hoạt động của Next.js trong dự án

Mỗi thư mục trong app/ tương ứng với một route.

File page.tsx đại diện cho giao diện hiển thị.

File layout.tsx định nghĩa bố cục chung (Header, Footer, Menu).

Dữ liệu được lấy từ Backend Node.js API (port 8080).

▶️ Cách chạy dự án (Development)
1️⃣ Cài đặt thư viện
npm install
2️⃣ Chạy frontend Next.js
npm run dev --prefix client

Sau khi chạy thành công, truy cập:

http://localhost:3000
▶️ Chạy toàn bộ hệ thống (Full Stack)

Tại thư mục gốc project:

npm run dev

Lệnh này sẽ chạy đồng thời:

Admin (Laravel) – PHP Artisan

Backend (Node.js) – API Server

Frontend (Next.js) – Client
