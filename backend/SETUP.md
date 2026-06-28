# Reshelf Backend Setup Guide

## 📋 Prerequisites
- Node.js v18+ installed
- PostgreSQL database (via Supabase)
- Cloudinary account

---

## 🔑 Lấy Tokens từ các dịch vụ

### 1. **Supabase PostgreSQL**

1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng nhập hoặc tạo tài khoản mới
3. Tạo project mới:
   - Click **"New Project"**
   - Chọn organization
   - Nhập tên project, database password (LƯU LẠI PASSWORD NÀY!)
   - Chọn region gần nhất (Singapore cho VN)
4. Lấy DATABASE_URL:
   - Vào **Settings** → **Database**
   - Tìm phần **Connection string** → **URI**
   - Copy chuỗi dạng: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - Thay `[YOUR-PASSWORD]` bằng password bạn đã tạo ở bước 3

### 2. **Cloudinary**

1. Truy cập [https://cloudinary.com](https://cloudinary.com)
2. Đăng ký tài khoản free (không cần thẻ tín dụng)
3. Sau khi đăng nhập, vào **Dashboard**
4. Lấy thông tin:
   - **Cloud Name**: Hiển thị ở đầu dashboard
   - **API Key**: Trong phần "Account Details"
   - **API Secret**: Click "Reveal" để xem (lưu lại ngay!)

### 3. **JWT Secret**

Tạo JWT secret bằng lệnh:

```bash
openssl rand -base64 32
```

Copy output và dùng làm `JWT_SECRET`

---

## 🚀 Installation Steps

### 1. Install dependencies

```bash
cd /home/thanhngo/grab-hackathon/reshelf/backend
npm install
```

### 2. Configure environment

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Mở file `.env` và điền thông tin:

```env
PORT=3000
NODE_ENV=development

# Database (paste your Supabase connection string)
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres"

# JWT (paste generated secret)
JWT_SECRET=your-generated-secret-here
JWT_EXPIRES_IN=7d

# Cloudinary (paste your credentials)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

CLIENT_URL=*
```

### 3. Setup Database

Generate Prisma client:

```bash
npm run prisma:generate
```

Run migrations:

```bash
npm run prisma:migrate
```

(Optional) Open Prisma Studio để xem database:

```bash
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

Test health endpoint:

```bash
curl http://localhost:3000/health
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy profile (cần JWT)

### Products
- `POST /api/products` - Tạo sản phẩm (SELLER/ADMIN, upload ảnh)
- `GET /api/products` - Lấy danh sách sản phẩm (có filter, search, pagination)
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

---

## 🧪 Testing với Postman/Thunder Client

### 1. Register user

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "seller@example.com",
  "password": "password123",
  "name": "John Seller",
  "phone": "0901234567",
  "role": "SELLER"
}
```

### 2. Login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "seller@example.com",
  "password": "password123"
}
```

Lưu lại `token` từ response!

### 3. Create Product (với upload ảnh)

```http
POST http://localhost:3000/api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

name: "Sữa tươi Vinamilk gần hết hạn"
description: "Sữa tươi không đường, còn 3 ngày hết hạn"
originalPrice: 25000
discountPrice: 15000
expiryDate: 2026-06-30
stock: 10
condition: GOOD
categoryId: (cần tạo category trước)
images: [file1.jpg, file2.jpg]
```

---

## 🗂️ Cấu trúc Project

```
backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── config/
│   │   ├── database.ts     # Prisma client
│   │   └── cloudinary.ts   # Cloudinary + multer config
│   ├── middleware/
│   │   ├── auth.ts         # JWT authentication
│   │   └── errorHandler.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── productController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── productRoutes.ts
│   └── server.ts           # Entry point
├── .env                    # Environment variables (GIT IGNORED)
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔐 Security Notes

- **.env** đã được thêm vào `.gitignore` - KHÔNG commit file này!
- Password được hash bằng bcrypt
- JWT có expiration time
- Upload ảnh giới hạn 5 ảnh/request, max size 10MB (có thể config trong cloudinary.ts)
- CORS được config để React Native có thể gọi API

---

## 📱 Kết nối với React Native

Trong React Native app:

```javascript
const API_URL = 'http://YOUR_LOCAL_IP:3000/api';

// Example: Login
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

**Chú ý**: 
- Nếu test trên máy thật: dùng IP máy tính (vd: `http://192.168.1.100:3000`)
- Nếu test trên emulator Android: dùng `http://10.0.2.2:3000`
- Nếu test trên iOS simulator: dùng `http://localhost:3000`

---

## 🚧 Next Steps

Bạn có thể thêm:
- [ ] Order routes & controller
- [ ] Category routes (CRUD)
- [ ] Review system
- [ ] Payment integration
- [ ] Email notifications
- [ ] Rate limiting
- [ ] API documentation (Swagger)

---

## 🐛 Troubleshooting

**Lỗi kết nối database:**
- Kiểm tra DATABASE_URL trong `.env`
- Kiểm tra Supabase project đã được pause chưa (free tier có thể pause sau 7 ngày không dùng)

**Lỗi upload ảnh:**
- Kiểm tra Cloudinary credentials
- Kiểm tra file size không quá lớn

**Lỗi JWT:**
- Kiểm tra JWT_SECRET đã được set chưa
- Kiểm tra token có đúng format `Bearer <token>` không
