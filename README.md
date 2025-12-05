# FORDEER - Hệ thống Quản lý Cửa hàng Đồ uống

Ứng dụng web quản lý cửa hàng đồ uống toàn diện với giao diện hiện đại, hỗ trợ quản lý sản phẩm, khách hàng, đơn hàng, nhập kho và thống kê doanh thu.

## 🚀 Tính năng chính

### 📊 Tổng quan & Thống kê

- Dashboard hiển thị các chỉ số kinh doanh quan trọng
- Biểu đồ cột và đường thể hiện sản phẩm bán chạy
- Thống kê doanh thu, đơn hàng, khách hàng
- Danh sách đơn hàng gần đây

### 🛍️ Quản lý Sản phẩm

- Thêm, sửa, xóa sản phẩm
- Phân loại theo danh mục (Cà phê, Trà sữa, Trà, Nước ép, Latte)
- Quản lý giá và số lượng tồn kho
- Tìm kiếm và lọc sản phẩm
- Phân trang dữ liệu

### 👥 Quản lý Khách hàng

- Thêm, sửa, xóa (soft delete) khách hàng
- Lưu trữ thông tin: tên, email, số điện thoại, địa chỉ, năm sinh
- Xem lịch sử đơn hàng của khách hàng
- Tính tổng chi tiêu
- Khôi phục khách hàng đã xóa

### 📦 Quản lý Đơn hàng

- Tạo đơn hàng mới với nhiều sản phẩm
- Quản lý trạng thái: Chờ xử lý, Đang xử lý, Hoàn thành, Đã hủy
- Áp dụng giảm giá
- Kiểm tra tồn kho tự động
- Xem chi tiết đơn hàng
- Hủy đơn hàng

### 📥 Quản lý Nhập kho

- Tạo phiếu nhập kho
- Cập nhật số lượng tồn kho tự động
- Ghi nhận nhà cung cấp, đơn giá, tổng tiền
- Xóa phiếu nhập (hoàn trả số lượng)
- Thống kê nhập kho theo sản phẩm

### 🔐 Xác thực & Phân quyền

- Đăng nhập/Đăng xuất
- Phân quyền Admin và Staff
- Chỉ Admin mới có thể tạo tài khoản mới
- JWT token authentication

### ⚙️ Cài đặt

- Giao diện: Sáng, Tối, Theo hệ thống
- Ngôn ngữ: Tiếng Việt, English
- Thông báo: Email, Push, Marketing
- Modal dialog hiện đại

## 🛠️ Công nghệ sử dụng

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## 📁 Cấu trúc dự án

```
foorder-app/
├── src/
│   ├── components/              # React components
│   │   ├── ui/                 # UI components (Button, Dialog, etc.)
│   │   ├── DashboardLayout.tsx # Main layout với sidebar
│   │   ├── SettingsDialog.tsx  # Settings modal
│   │   ├── ProductDialog.tsx   # Dialog quản lý sản phẩm
│   │   ├── CustomerDialog.tsx  # Dialog quản lý khách hàng
│   │   ├── OrderDialog.tsx     # Dialog tạo đơn hàng
│   │   ├── StockEntryDialog.tsx # Dialog nhập kho
│   │   └── ...
│   ├── pages/                   # Page components
│   │   ├── Dashboard.tsx       # Tổng quan & thống kê
│   │   ├── Products.tsx        # Quản lý sản phẩm
│   │   ├── Customers.tsx       # Quản lý khách hàng
│   │   ├── Orders.tsx          # Quản lý đơn hàng
│   │   ├── Inventory.tsx       # Quản lý nhập kho
│   │   ├── Login.tsx           # Đăng nhập
│   │   ├── Register.tsx        # Đăng ký (Admin only)
│   │   └── Profile.tsx         # Hồ sơ cá nhân
│   ├── services/               # API services
│   │   ├── authService.ts      # Authentication
│   │   ├── productService.ts   # Products API
│   │   ├── customerService.ts  # Customers API
│   │   ├── orderService.ts     # Orders API
│   │   ├── stockEntryService.ts # Stock entries API
│   │   └── reportService.ts    # Reports & statistics
│   ├── types/                  # TypeScript type definitions
│   │   └── api.ts              # API types
│   ├── config/                 # Configuration
│   │   └── api.ts              # Axios config
│   ├── lib/                    # Utilities
│   │   └── utils.ts            # Helper functions
│   └── App.tsx                 # Root component
│
├── public/                      # Static assets
│   ├── Vector.png              # Logo
│   └── _redirects              # Netlify redirects
├── .env.example                # Environment template
├── vercel.json                 # Vercel config (SPA routing)
└── package.json                # Dependencies
```

## 🚦 Cài đặt và Chạy

### Yêu cầu

- Node.js >= 18
- npm hoặc yarn

### 1. Clone repository

```bash
git clone <repository-url>
cd foorder-app
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```env
VITE_API_URL=https://your-backend-api.com/api
```

### 4. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### 5. Build production

```bash
npm run build
```

Output sẽ được tạo trong thư mục `dist/`

### 6. Preview production build

```bash
npm run preview
```

## 🎨 Giao diện

### Theme

- **Sáng**: Giao diện sáng, dễ nhìn ban ngày
- **Tối**: Giao diện tối, bảo vệ mắt ban đêm (đang phát triển)
- **Hệ thống**: Tự động theo cài đặt hệ điều hành (đang phát triển)

### Màu sắc chủ đạo

- **Primary**: Xanh lá (#4A7C59)
- **Background**: Trắng/Xám nhạt (#F9FAFB)
- **Accent**: Xanh lá nhạt (#E8F5E9)
- **Border**: Xám (#E5E7EB)

### Responsive Design

Giao diện tối ưu cho:

- **Desktop** (>= 1024px) - Full sidebar, multi-column layout
- **Tablet** (768px - 1023px) - Collapsible sidebar
- **Mobile** (< 768px) - Hamburger menu, single column

## 📱 Screenshots

### Dashboard

Tổng quan với các chỉ số kinh doanh, biểu đồ và đơn hàng gần đây

### Quản lý Sản phẩm

Danh sách sản phẩm với tìm kiếm, lọc và phân trang

### Quản lý Đơn hàng

Tạo và theo dõi đơn hàng với nhiều trạng thái

### Thống kê

Biểu đồ trực quan về doanh thu và sản phẩm bán chạy

## 🔒 Bảo mật

- JWT token authentication
- Token được lưu trong localStorage
- Auto logout khi token hết hạn
- Protected routes với PrivateRoute component
- Input validation trên client-side
- XSS protection

## 🐛 Troubleshooting

### Lỗi kết nối API

```bash
# Kiểm tra VITE_API_URL trong .env
# Đảm bảo backend đang chạy và CORS được cấu hình đúng
```

### Lỗi 404 khi refresh trang

- File `vercel.json` và `public/_redirects` đã được cấu hình
- Nếu deploy trên hosting khác, cần cấu hình SPA routing tương tự

### Lỗi build

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm run build -- --force
```

## 📝 Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Chạy ESLint
```

## 🔄 Cập nhật

Để cập nhật dependencies:

```bash
npm update
```

Kiểm tra outdated packages:

```bash
npm outdated
```

## 📞 API Backend

Ứng dụng này kết nối với backend API riêng biệt. Các endpoint chính:

- `POST /api/login` - Đăng nhập
- `POST /api/logout` - Đăng xuất
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/customers` - Lấy danh sách khách hàng
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/stock-entries` - Lấy danh sách phiếu nhập
- `GET /api/reports/best-selling` - Sản phẩm bán chạy

Chi tiết API documentation có tại backend repository.

## 👤 Tài khoản Demo

```
Email: admin@fordeer.com
Password: admin123
```

**⚠️ Lưu ý:** Đây là tài khoản demo, đổi mật khẩu sau khi đăng nhập!

## 📝 License

MIT License

## 👨‍💻 Tác giả

Dự án được phát triển bởi nhóm sinh viên

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

---

**Made with ❤️ for beverage shop management**
