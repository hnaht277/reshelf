# Reshelf Backend - Quick Start

Backend đã được setup và đang chạy thành công! 

## ✅ Đã Setup

- ✅ Node.js + Express + TypeScript
- ✅ Prisma ORM
- ✅ JWT Authentication
- ✅ Cloudinary image upload
- ✅ Error handling middleware
- ✅ CORS configuration

## 🔧 Các File Quan Trọng

### Configuration
- [.env](.env) - Environment variables (cần điền credentials)
- [prisma/schema.prisma](prisma/schema.prisma) - Database schema

### Source Code
- [src/server.ts](src/server.ts) - Entry point
- [src/config/](src/config/) - Database & Cloudinary config
- [src/middleware/](src/middleware/) - Auth & error handling
- [src/controllers/](src/controllers/) - Business logic
- [src/routes/](src/routes/) - API routes

---

## 🔑 Lấy Credentials từ Các Dịch Vụ

### 1. **Supabase PostgreSQL**

**Bước 1:** Đăng ký tại [https://supabase.com](https://supabase.com)

**Bước 2:** Tạo project mới
- Click **"New Project"**
- Chọn organization (hoặc tạo mới)
- Nhập tên project: `reshelf`
- Tạo **Database Password** (LƯU LẠI PASSWORD NÀY!)
- Chọn region: **Singapore** (gần Việt Nam nhất)
- Click **"Create new project"** (đợi ~2 phút)

**Bước 3:** Lấy DATABASE_URL
- Vào **Settings** (sidebar bên trái) → **Database**
- Scroll xuống phần **Connection string**
- Chọn tab **URI**
- Copy chuỗi dạng: 
  ```
  postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
  ```
- Thay `[YOUR-PASSWORD]` bằng password bạn đã tạo ở bước 2

**Lưu ý:** Nếu dùng Connection Pooling, URL sẽ có port `6543`. Nếu dùng Direct connection, port là `5432`.

---

### 2. **Cloudinary (Image Upload)**

**Bước 1:** Đăng ký tại [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
- Hoàn toàn miễn phí, không cần thẻ tín dụng
- Free tier: 25 GB storage, 25 GB bandwidth/tháng (đủ cho demo)

**Bước 2:** Sau khi đăng ký, vào **Dashboard**

**Bước 3:** Lấy credentials từ phần **Account Details**:
- **Cloud Name**: Hiển thị rõ ràng (vd: `dxxxx123abc`)
- **API Key**: Dãy số dài (vd: `123456789012345`)
- **API Secret**: Click nút **"Reveal"** để xem (vd: `abcXYZ123_secretKey`)

**Copy cả 3 giá trị này!**

---

### 3. **JWT Secret**

**Trên Linux/Mac:**
```bash
openssl rand -base64 32
```

**Trên Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Hoặc dùng online:** [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

Copy output (vd: `k7L9mP2nR4sT6vW8xZ0aB1cD3eF5gH7i`)

---

## 🚀 Setup Backend

### Bước 1: Cài đặt dependencies

```bash
cd /home/thanhngo/grab-hackathon/reshelf/backend
npm install
```

### Bước 2: Điền Environment Variables

Mở file [.env](.env) và điền thông tin:

```env
PORT=3000
NODE_ENV=development

# Paste Supabase DATABASE_URL vào đây
DATABASE_URL="postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Paste JWT secret vào đây
JWT_SECRET=k7L9mP2nR4sT6vW8xZ0aB1cD3eF5gH7i
JWT_EXPIRES_IN=7d

# Paste Cloudinary credentials vào đây
CLOUDINARY_CLOUD_NAME=dxxxx123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcXYZ123_secretKey

CLIENT_URL=*
```

### Bước 3: Setup Database

**Generate Prisma Client:**
```bash
npm run prisma:generate
```

**Chạy migrations để tạo tables:**
```bash
npm run prisma:migrate
```
- Khi được hỏi "Enter a name for the new migration:", gõ: `init`

**Kiểm tra database (optional):**
```bash
npm run prisma:studio
```
Mở browser tại `http://localhost:5555` để xem database UI.

### Bước 4: Start Server

```bash
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

**Test health endpoint:**
```bash
curl http://localhost:3000/health
```

Kết quả mong đợi:
```json
{"status":"ok","message":"Reshelf API is running"}
```

---

## 📡 API Endpoints

### **Authentication**

#### Register User
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

**Response:**
```json
{
  "user": {
    "id": "clxxx...",
    "email": "seller@example.com",
    "name": "John Seller",
    "phone": "0901234567",
    "role": "SELLER",
    "avatar": null,
    "createdAt": "2026-06-27T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "seller@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)
```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### **Products**

#### Create Product (SELLER only, with image upload)
```http
POST http://localhost:3000/api/products
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

name: "Sữa tươi Vinamilk gần hết hạn"
description: "Sữa tươi không đường, còn 3 ngày hết hạn"
originalPrice: 25000
discountPrice: 15000
expiryDate: 2026-06-30
stock: 10
condition: GOOD
categoryId: [category-id]
images: [file1.jpg, file2.jpg]
```

**Lưu ý:** Cần tạo category trước. Xem phần "Seed Data" bên dưới.

#### Get All Products (Public)
```http
GET http://localhost:3000/api/products?page=1&limit=20&search=sữa
```

**Query params:**
- `page`: Trang số (default: 1)
- `limit`: Số items per page (default: 20)
- `categoryId`: Filter theo category
- `minPrice`, `maxPrice`: Filter theo giá
- `condition`: EXCELLENT | GOOD | FAIR
- `search`: Tìm kiếm trong name và description

#### Get Product by ID
```http
GET http://localhost:3000/api/products/:id
```

#### Update Product (Owner or ADMIN)
```http
PUT http://localhost:3000/api/products/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "discountPrice": 12000,
  "stock": 8
}
```

#### Delete Product (Owner or ADMIN)
```http
DELETE http://localhost:3000/api/products/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🌱 Seed Data (Tạo dữ liệu mẫu)

### Tạo Categories

Dùng Prisma Studio hoặc SQL:

```bash
npm run prisma:studio
```

Hoặc vào Supabase Dashboard → SQL Editor và chạy:

```sql
INSERT INTO categories (id, name, description) VALUES 
('cat001', 'Dairy', 'Sữa và sản phẩm từ sữa'),
('cat002', 'Bakery', 'Bánh mì, bánh ngọt'),
('cat003', 'Beverages', 'Nước uống'),
('cat004', 'Snacks', 'Đồ ăn vặt');
```

Sau đó dùng `categoryId: 'cat001'` khi tạo product.

---

## 📱 Kết nối với React Native

### Setup Axios

```bash
npm install axios
```

### Config API

```javascript
// src/api/config.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Thay đổi base URL tùy môi trường
const API_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'  // Android Emulator
  : 'https://your-production-url.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add JWT token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Example Usage

```javascript
// Register
const register = async (data) => {
  const response = await api.post('/auth/register', data);
  await AsyncStorage.setItem('token', response.data.token);
  return response.data;
};

// Get products
const getProducts = async (params) => {
  const response = await api.get('/products', { params });
  return response.data;
};

// Upload product with images
const createProduct = async (data, images) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  
  images.forEach((image, index) => {
    formData.append('images', {
      uri: image.uri,
      type: 'image/jpeg',
      name: `photo-${index}.jpg`,
    });
  });
  
  const response = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data;
};
```

### Network Config Notes

**Android Emulator:**
- Dùng `http://10.0.2.2:3000` để trỏ đến localhost của máy host

**iOS Simulator:**
- Dùng `http://localhost:3000`

**Real Device (cùng WiFi):**
- Lấy IP máy tính: `ipconfig` (Windows) hoặc `ifconfig` (Mac/Linux)
- Dùng `http://192.168.x.x:3000` (thay x.x bằng IP thật)

---

## 🗂️ Database Schema

Các models chính:

### User
- id, email, password (hashed), name, phone, avatar
- role: BUYER | SELLER | ADMIN

### Product
- name, description, originalPrice, discountPrice
- images (array of URLs)
- expiryDate, stock, condition (EXCELLENT/GOOD/FAIR)
- status: AVAILABLE | SOLD | RESERVED | EXPIRED
- Relations: seller (User), category (Category)

### Category
- name, description, icon

### Order
- orderNumber, buyerId, totalAmount
- status: PENDING | CONFIRMED | SHIPPING | DELIVERED | CANCELLED
- shippingAddress, paymentMethod

### OrderItem
- orderId, productId, quantity, price

### Review
- rating (1-5), comment, userId, productId

---

## 🛡️ Security Features

- ✅ Password hashing với bcrypt
- ✅ JWT authentication với expiration
- ✅ CORS configuration
- ✅ File upload validation (chỉ images, max 10MB)
- ✅ Protected routes với middleware
- ✅ Role-based authorization (BUYER/SELLER/ADMIN)

---

## 📝 Scripts

```bash
npm run dev          # Development với hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Production (cần build trước)
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio UI
```

---

## 🐛 Troubleshooting

### Lỗi: "Can't reach database server"
- Kiểm tra DATABASE_URL trong `.env`
- Kiểm tra Supabase project có đang pause không (free tier pause sau 7 ngày không dùng)
- Thử restart Supabase project từ dashboard

### Lỗi: "Invalid token"
- Kiểm tra JWT_SECRET có được set trong `.env` không
- Kiểm tra format header: `Authorization: Bearer <token>`
- Token có thể đã expire (default: 7 ngày)

### Lỗi upload ảnh
- Kiểm tra Cloudinary credentials trong `.env`
- Kiểm tra file size không quá 10MB
- Kiểm tra file type phải là image (jpg, png, webp)

### Port 3000 đã được sử dụng
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 🚧 Next Steps

Các tính năng có thể mở rộng:

- [ ] Order management endpoints
- [ ] Category CRUD endpoints
- [ ] Review system
- [ ] Search with filters (expiry date range, location)
- [ ] Payment integration (Momo, ZaloPay)
- [ ] Email notifications (SendGrid, Resend)
- [ ] Push notifications (Firebase)
- [ ] Rate limiting
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit & integration tests
- [ ] Docker deployment

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs trong terminal
2. Check Prisma Studio để xem database state
3. Check Cloudinary Dashboard để verify uploads
4. Check Supabase Dashboard → Database → Logs

Good luck với project Reshelf! 🚀
