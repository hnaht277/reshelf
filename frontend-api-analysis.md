# Phân tích Frontend và đề xuất REST API Backend cho Reshelf

Backend mục tiêu: **Node.js + Express + Prisma + PostgreSQL trên Supabase**, xác thực bằng **JWT Authentication**. Ảnh được upload lên **Cloudinary**, database chỉ lưu URL.

## 1. Danh sách page/screen hiện có

| Nhóm | Screen | Route |
| --- | --- | --- |
| Bottom tab | Home | `MainTabs > Home` |
| Bottom tab | Explore | `MainTabs > Explore` |
| Bottom tab | Cart | `MainTabs > Cart` |
| Bottom tab | Notifications | `MainTabs > Notifications` |
| Bottom tab | Profile | `MainTabs > Profile` |
| Stack | Product Detail | `ProductDetail` |
| Stack | Order History | `OrderHistory` |
| Stack | Order Detail | `OrderDetail` |
| Stack | Saved Items | `SavedItems` |
| Stack | Settings | `Settings` |
| Stack | Help | `Help` |
| Stack | About | `About` |

## 2. Phân tích từng page

### 2.1. Home

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | Trang chính hiển thị lời chào, impact summary, tìm kiếm, category filter, AI picks, sản phẩm sắp hết hạn hôm nay và danh sách sản phẩm có phân trang. |
| Component chính | `HomeScreen`, `SearchBar`, `Chip`, `ProductCard`, `ProductSkeletonGrid`, `EmptyState`, `PersonalizedSuggestionCard` nội bộ. |
| Mock data | User/impact/preferences từ `useUserStore`; products từ `src/data/products.ts`; orders từ `src/data/orders.ts`; API giả từ `src/services/api.ts`; recent searches trong `useProductStore`. |
| Cấu trúc dữ liệu | `Product`: `id`, `name`, `price`, `originalPrice`, `discount`, `expiryDate`, `category`, `seller`, `imageUrl`, `stock`, `co2Savings`, `description`, `reason`. `Seller`: `id`, `name`, `avatarUrl`, `rating`, `distanceKm`, `verified`. `Order`: `id`, `placedAt`, `status`, `items`, `total`, `co2Saved`. `UserImpact`: `mealsRescued`, `co2SavedKg`, `moneySaved`, `streakDays`. |
| User actions | Search debounced, bấm recent search, chọn category, đổi layout grid/list, kéo refresh, infinite scroll, mở product detail, bấm AI pick/product card. |
| Trạng thái cần xử lý | Loading skeleton, loading more, refreshing, empty result, error khi load products/recommendations/user profile, success khi đổi preference layout. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/me` | JWT | `{ user, impact, preferences }` |
| `GET` | `/api/products` | `page`, `limit`, `category`, `q`, `sort`, `expiresBefore`, `nearbyLat`, `nearbyLng` | `{ items: Product[], page, limit, total, hasMore }` |
| `GET` | `/api/products/expiring-today` | `limit`, optional location | `{ items: Product[] }` |
| `GET` | `/api/recommendations/products` | `limit` | `{ items: { product: Product, reason: string, score?: number }[] }` |
| `GET` | `/api/search/recent` | JWT | `{ items: string[] }` |
| `POST` | `/api/search/recent` | `{ query: string }` | `{ items: string[] }` |
| `PATCH` | `/api/me/preferences` | `{ layout?: "grid" \| "list" }` | `{ preferences }` |

### 2.2. Explore

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | Trang khám phá sản phẩm gần người dùng, hỗ trợ search/filter category và sort theo khoảng cách. |
| Component chính | `ExploreScreen`, `SearchBar`, `Chip`, `ProductCard`, `EmptyState`. |
| Mock data | `products` từ `src/data/products.ts`; filter/sort xử lý trực tiếp trong component. |
| Cấu trúc dữ liệu | Dùng `Product` và `Seller.distanceKm`. Category hiện là union: `Food`, `Beverages`, `Dairy`, `Bakery`, `Personal Care`, `Household`. |
| User actions | Nhập search, chọn category, pull-to-refresh giả, mở product detail. |
| Trạng thái cần xử lý | Loading, refreshing, empty, error, success khi list load xong. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/products` | `q`, `category`, `page`, `limit`, `sort=distance`, `lat`, `lng`, `radiusKm` | `{ items: Product[], page, limit, total, hasMore }` |
| `GET` | `/api/categories` | none | `{ items: { id, name, slug }[] }` |

### 2.3. Product Detail

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | Hiển thị chi tiết sản phẩm, freshness, giá, seller, stock, impact, lý do sản phẩm có trên Reshelf; cho phép save, add to cart, buy now. |
| Component chính | `ProductDetailScreen`, `Badge`, `Button`, `QuantityStepper`. |
| Mock data | `getProductById` trong `src/services/api.ts` đọc từ `src/data/products.ts`; saved ids từ `useSavedStore`; cart local trong `useCartStore`. |
| Cấu trúc dữ liệu | `Product` đầy đủ; `Seller`; `CartItem`: `{ product, quantity }`; saved hiện chỉ là `productIds: string[]`. |
| User actions | Back, save/unsave, tăng/giảm quantity, mở collapsible "Why it is on Reshelf", add to cart, buy now. |
| Trạng thái cần xử lý | Loading product, not found/error, out of stock/stock changed, success add cart/save, disabled khi expired/out of stock. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/products/:id` | path `id` | `{ product: Product }` |
| `POST` | `/api/saved-products` | `{ productId: string }` | `{ saved: true, productId }` |
| `DELETE` | `/api/saved-products/:productId` | path `productId` | `{ saved: false, productId }` |
| `POST` | `/api/cart/items` | `{ productId: string, quantity: number }` | `{ cart }` |
| `PATCH` | `/api/cart/items/:productId` | `{ quantity: number }` | `{ cart }` |

### 2.4. Cart

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | Quản lý giỏ hàng, quantity, xóa item, tính subtotal/savings/CO2, checkout mock và modal success. |
| Component chính | `CartScreen`, `CartItemRow`, `QuantityStepper`, `Button`, `EmptyState`. |
| Mock data | Cart local trong `useCartStore`; checkout giả trong `src/services/api.ts`; delivery fee `20000` và eco discount `5000` hard-code trong `CartScreen`. |
| Cấu trúc dữ liệu | `CartItem`: `{ product: Product, quantity: number }`; `CheckoutResult`: `orderId`, `itemsRescued`, `co2Saved`, `total`. |
| User actions | Clear all, remove item, tăng/giảm quantity, proceed checkout, đóng success modal. |
| Trạng thái cần xử lý | Empty cart, stock invalid, loading checkout, checkout success, checkout error/payment error, cart recalculation. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/cart` | JWT | `{ cart: { id, items, subtotal, originalSubtotal, savings, deliveryFee, ecoDiscount, total, co2Saved } }` |
| `POST` | `/api/cart/items` | `{ productId, quantity }` | `{ cart }` |
| `PATCH` | `/api/cart/items/:productId` | `{ quantity }` | `{ cart }` |
| `DELETE` | `/api/cart/items/:productId` | path `productId` | `{ cart }` |
| `DELETE` | `/api/cart` | JWT | `{ cart }` |
| `POST` | `/api/checkout` | `{ cartId, pickupNote?: string }` | `{ order: Order, impactDelta, cart }` |

### 2.5. Notifications

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | Hiển thị notification theo nhóm Today/Yesterday/Earlier, unread count, mark read, mark all read, swipe delete + undo. |
| Component chính | `NotificationsScreen`, `EmptyState`, `Swipeable`, `ToastHost`. |
| Mock data | `src/data/notifications.ts`; store `useNotificationStore`; `getNotifications` trong `src/services/api.ts`. |
| Cấu trúc dữ liệu | `AppNotification`: `id`, `type`, `title`, `body`, `createdAt`, `read`. Type: `new-listing`, `price-drop`, `expiry-alert`, `order-update`, `impact`. |
| User actions | Pull refresh, mark all read, tap notification để mark read, swipe delete, undo restore. |
| Trạng thái cần xử lý | Loading, empty, error, success mark read/delete/restore, optimistic update rollback. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/notifications` | `page`, `limit`, `read?`, `type?` | `{ items: Notification[], unreadCount, page, hasMore }` |
| `PATCH` | `/api/notifications/:id/read` | none hoặc `{ read: true }` | `{ notification }` |
| `PATCH` | `/api/notifications/read-all` | none | `{ unreadCount: 0 }` |
| `DELETE` | `/api/notifications/:id` | path `id` | `{ deleted: true }` |
| `POST` | `/api/notifications/:id/restore` | optional | `{ notification }` |

### 2.6. Profile

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | Hiển thị user card, impact dashboard, eco badges, quick links; modal chỉnh sửa thông tin cá nhân. |
| Component chính | `ProfileScreen`, `EditProfileModal`, `FormField`, `Button`, `LinearGradient`. |
| Mock data | `useUserStore`: user, impact, preferences; badges hard-code trong `ProfileScreen`; quick links hard-code. |
| Cấu trúc dữ liệu | `User`: `firstName`, `fullName`, `avatarUrl`, `memberSince`, `birthDate`, `gender`, `phone`, `email`. `Impact`: `mealsRescued`, `co2SavedKg`, `moneySaved`, `streakDays`. Badge hiện có `label`, `icon`, `earned`. |
| User actions | Bấm user card mở edit modal, sửa name/date of birth/gender/phone/email, save/cancel, vào Order History/Saved/Settings/Help/About. |
| Trạng thái cần xử lý | Loading profile/impact, validation error, update success, update error, avatar upload progress nếu thêm đổi avatar bằng Cloudinary. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/me` | JWT | `{ user, impact, preferences, badges }` |
| `PATCH` | `/api/me` | `{ fullName?, birthDate?, gender?, phone?, email? }` | `{ user }` |
| `POST` | `/api/uploads/avatar` | multipart image | `{ url, publicId }` |
| `PATCH` | `/api/me/avatar` | `{ avatarUrl, cloudinaryPublicId? }` | `{ user }` |
| `GET` | `/api/me/impact` | JWT | `{ mealsRescued, co2SavedKg, moneySaved, streakDays }` |
| `GET` | `/api/me/badges` | JWT | `{ items: Badge[] }` |

### 2.7. Order History

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | Liệt kê đơn hàng, filter All/Active/Completed, hiển thị trạng thái, tóm tắt item, CO2, total; hỗ trợ order again. |
| Component chính | `OrderHistoryScreen`, `OrderCard`, `Button`. |
| Mock data | `src/data/orders.ts`; product lồng trong order lấy từ `src/data/products.ts`; reorder dùng `useCartStore`. |
| Cấu trúc dữ liệu | `Order`: `id`, `placedAt`, `status`, `items`, `total`, `co2Saved`. `OrderStatus`: `ready`, `delivered`, `cancelled`. |
| User actions | Chọn filter, mở order detail, order again thêm item vào cart. |
| Trạng thái cần xử lý | Loading, empty theo filter, error, success reorder, sản phẩm reorder hết hàng/không còn tồn tại. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/orders` | `status?`, `page`, `limit` | `{ items: Order[], page, limit, total, hasMore }` |
| `POST` | `/api/orders/:id/reorder` | path `id` | `{ cart, unavailableItems?: { productId, reason }[] }` |

### 2.8. Order Detail

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | Chi tiết đơn hàng: trạng thái, pickup code, timeline, item list, seller pickup details, payment summary, order again. |
| Component chính | `OrderDetailScreen`, `Section`, `TimelineStep`, `SummaryRow`, `Button`. |
| Mock data | `src/data/orders.ts`; address pickup hard-code: `128 Nguyễn Trãi, Quận 5`; pickup time hard-code `Collect before 7:00 PM today`; pickup code lấy từ `order.id.slice(-4)`. |
| Cấu trúc dữ liệu | `Order` + embedded `CartItem/Product/Seller`; cần thêm backend fields: `pickupCode`, `pickupAddress`, `pickupWindowStart`, `pickupWindowEnd`, `timeline`. |
| User actions | Back, mở product detail từ item, order again. |
| Trạng thái cần xử lý | Loading detail, not found, error, success reorder, cancelled state, ready/delivered state. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/orders/:id` | path `id` | `{ order: OrderDetail }` |
| `POST` | `/api/orders/:id/reorder` | path `id` | `{ cart, unavailableItems?: [] }` |

### 2.9. Saved Items

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | Hiển thị sản phẩm đã lưu, mở detail, remove saved, add to cart. |
| Component chính | `SavedItemsScreen`, `SavedItem`, `Badge`, `Button`, `EmptyState`. |
| Mock data | `useSavedStore` có `productIds` hard-code; map product từ `src/data/products.ts`; cart local. |
| Cấu trúc dữ liệu | `SavedProduct`: hiện là `productId`; page cần `Product` đầy đủ để render. |
| User actions | Open product, remove saved, add to cart, CTA Explore khi empty. |
| Trạng thái cần xử lý | Loading, empty, error, success remove/add cart, saved item expired/out of stock. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/saved-products` | `page`, `limit` | `{ items: Product[], page, hasMore }` |
| `POST` | `/api/saved-products` | `{ productId }` | `{ saved: true, productId }` |
| `DELETE` | `/api/saved-products/:productId` | path `productId` | `{ saved: false, productId }` |
| `POST` | `/api/cart/items` | `{ productId, quantity }` | `{ cart }` |

### 2.10. Settings

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | Cho phép đổi product layout và notification preferences. |
| Component chính | `SettingsScreen`, `ProfilePageHeader`, `LayoutOption`, `SettingToggle`. |
| Mock data | `useUserStore.preferences`: `layout`, `priceDropAlerts`, `expiryReminders`, `impactUpdates`. |
| Cấu trúc dữ liệu | `Preferences`: `layout: "grid" | "list"`, `priceDropAlerts: boolean`, `expiryReminders: boolean`, `impactUpdates: boolean`. |
| User actions | Chọn grid/list, bật/tắt 3 notification toggles. |
| Trạng thái cần xử lý | Loading settings, optimistic update, success, error rollback. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/me/preferences` | JWT | `{ preferences }` |
| `PATCH` | `/api/me/preferences` | `{ layout?, priceDropAlerts?, expiryReminders?, impactUpdates? }` | `{ preferences }` |

### 2.11. Help

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | FAQ, support email, hướng dẫn người dùng. |
| Component chính | `HelpScreen`, `ProfilePageHeader`, FAQ accordion. |
| Mock data | FAQ hard-code trong `HelpScreen`; support email hard-code `support@reshelf.app`. |
| Cấu trúc dữ liệu | `FAQ`: `question`, `answer`, optional `order`, `category`, `published`. |
| User actions | Mở/đóng FAQ, mở mail app để email support. |
| Trạng thái cần xử lý | Loading FAQ, empty, error, success submit support nếu có form. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/help/faqs` | optional `category` | `{ items: FAQ[] }` |
| `POST` | `/api/support/tickets` | `{ subject, message, orderId? }` | `{ ticket: SupportTicket }` |

### 2.12. About

| Hạng mục | Chi tiết |
| --- | --- |
| Mục đích | Giới thiệu app, mission, values, version. |
| Component chính | `AboutScreen`, `ProfilePageHeader`, `ValueRow`. |
| Mock data | Toàn bộ nội dung hard-code trong `AboutScreen`: version, story, values, copyright. |
| Cấu trúc dữ liệu | `ContentPage`: `slug`, `title`, `subtitle`, `body`, `sections`, `version`. |
| User actions | Back. |
| Trạng thái cần xử lý | Loading CMS content, empty/fallback content, error. |

**API cần có**

| Method | Endpoint | Request/query | Response mong muốn |
| --- | --- | --- | --- |
| `GET` | `/api/content/about` | none | `{ page: ContentPage }` |
| `GET` | `/api/app-version` | none | `{ version, buildNumber?, minSupportedVersion? }` |

## 3. Entity/model backend suy ra từ FE

| Entity | Field chính |
| --- | --- |
| `User` | `id`, `email`, `phone`, `passwordHash`, `fullName`, `firstName`, `birthDate`, `gender`, `avatarUrl`, `avatarPublicId`, `memberSince`, `createdAt`, `updatedAt` |
| `UserPreference` | `id`, `userId`, `layout`, `priceDropAlerts`, `expiryReminders`, `impactUpdates` |
| `UserImpact` | `id`, `userId`, `mealsRescued`, `co2SavedKg`, `moneySaved`, `streakDays`, `lastRescueAt` |
| `Seller` | `id`, `name`, `avatarUrl`, `avatarPublicId`, `rating`, `distanceKm` hoặc geo fields, `verified`, `address`, `lat`, `lng`, `createdAt` |
| `Product` | `id`, `sellerId`, `name`, `price`, `originalPrice`, `discount`, `expiryDate`, `categoryId`, `imageUrl`, `imagePublicId`, `stock`, `co2Savings`, `description`, `reason`, `status`, `createdAt`, `updatedAt` |
| `Category` | `id`, `name`, `slug`, `sortOrder` |
| `Cart` | `id`, `userId`, `status`, `createdAt`, `updatedAt` |
| `CartItem` | `id`, `cartId`, `productId`, `quantity`, `unitPriceSnapshot`, `createdAt`, `updatedAt` |
| `Order` | `id`, `userId`, `sellerId`, `status`, `placedAt`, `total`, `subtotal`, `deliveryFee`, `ecoDiscount`, `co2Saved`, `pickupCode`, `pickupAddress`, `pickupWindowStart`, `pickupWindowEnd` |
| `OrderItem` | `id`, `orderId`, `productId`, `quantity`, `unitPrice`, `originalUnitPrice`, `productNameSnapshot`, `productImageUrlSnapshot` |
| `SavedProduct` | `id`, `userId`, `productId`, `createdAt` |
| `Notification` | `id`, `userId`, `type`, `title`, `body`, `read`, `deletedAt`, `createdAt`, `metadata` |
| `Badge` | `id`, `code`, `label`, `description`, `icon`, `thresholdType`, `thresholdValue` |
| `UserBadge` | `id`, `userId`, `badgeId`, `earnedAt`, `seenAt` |
| `SearchHistory` | `id`, `userId`, `query`, `createdAt` |
| `SupportTicket` | `id`, `userId`, `orderId`, `subject`, `message`, `status`, `createdAt` |
| `FAQ` | `id`, `question`, `answer`, `category`, `sortOrder`, `published` |
| `ContentPage` | `id`, `slug`, `title`, `subtitle`, `contentJson`, `updatedAt` |
| `UploadAsset` | `id`, `ownerId`, `url`, `publicId`, `resourceType`, `createdAt` |

## 4. Đề xuất database tables/collections với Prisma/PostgreSQL

Nên dùng PostgreSQL tables, không dùng Supabase Client trực tiếp từ FE.

| Table | Quan hệ chính | Ghi chú Prisma |
| --- | --- | --- |
| `users` | 1-1 `user_preferences`, 1-1 `user_impacts`, 1-n `orders`, 1-n `notifications`, n-n products qua `saved_products` | Email unique, phone optional unique. |
| `user_preferences` | `user_id` unique | Default khi register. |
| `user_impacts` | `user_id` unique | Update sau checkout/order delivered. |
| `sellers` | 1-n `products`, 1-n `orders` | Có thể thêm PostGIS sau; trước mắt lưu `lat`, `lng`. |
| `categories` | 1-n `products` | Seed categories FE đang dùng. |
| `products` | n-1 `seller`, n-1 `category`, 1-n `cart_items`, 1-n `order_items`, 1-n `saved_products` | `price` nên lưu integer VND. |
| `carts` | 1-n `cart_items`, n-1 `user` | Một active cart/user. |
| `cart_items` | n-1 `cart`, n-1 `product` | Unique `(cart_id, product_id)`. |
| `orders` | n-1 `user`, n-1 `seller`, 1-n `order_items` | ID có thể là text `RS-8421` hoặc cuid + displayCode. |
| `order_items` | n-1 `order`, n-1 `product` | Lưu snapshot để lịch sử không đổi khi product update. |
| `saved_products` | n-1 `user`, n-1 `product` | Unique `(user_id, product_id)`. |
| `notifications` | n-1 `user` | Soft delete bằng `deleted_at`. |
| `badges` | n-n `users` qua `user_badges` | Seed badge rules. |
| `user_badges` | n-1 `user`, n-1 `badge` | Unique `(user_id, badge_id)`. |
| `search_histories` | n-1 `user` | Có thể unique theo normalized query/user hoặc giữ lịch sử. |
| `faqs` | none | CMS nhẹ cho Help. |
| `content_pages` | none | About/static content. |
| `support_tickets` | n-1 `user`, optional n-1 `order` | Cho form support tương lai. |
| `upload_assets` | optional n-1 `user` | Lưu Cloudinary URL/publicId nếu cần quản lý asset. |

## 5. Những chỗ FE đang hard-code cần thay bằng API

| Vị trí | Hard-code hiện tại | Nên thay bằng |
| --- | --- | --- |
| `src/data/products.ts` | 20 sản phẩm, seller, image URL, expiry date dynamic | `/api/products`, `/api/products/:id`, `/api/sellers` |
| `src/data/orders.ts` | Lịch sử order và item lồng product | `/api/orders`, `/api/orders/:id` |
| `src/data/notifications.ts` | Notification list | `/api/notifications` |
| `useUserStore` | User profile, impact, preferences | `/api/me`, `/api/me/impact`, `/api/me/preferences` |
| `useSavedStore` | Saved product ids ban đầu | `/api/saved-products` |
| `useCartStore` | Cart local, subtotal/savings tự tính | `/api/cart` và cart item APIs |
| `CartScreen` | `DELIVERY_FEE = 20000`, `ECO_DISCOUNT = 5000` | Backend pricing/checkout quote |
| `services/api.ts` | Simulated delay, fake pagination, fake checkout | Express REST API thật |
| `HomeScreen` | AI picks tính local từ products + orders | `/api/recommendations/products` |
| `HomeScreen` | Recent searches `["yogurt", "bakery", "juice"]` | `/api/search/recent` |
| `OrderDetailScreen` | Pickup address, pickup time, pickup code từ order id | Order detail fields từ backend |
| `ProfileScreen` | Badges hard-code | `/api/me/badges` |
| `HelpScreen` | FAQ/support email hard-code | `/api/help/faqs`, `/api/support/tickets` |
| `AboutScreen` | About content/version hard-code | `/api/content/about`, `/api/app-version` |
| Image URLs | Unsplash URLs trong mock | Cloudinary URLs lưu trong DB |

## 6. API nên ưu tiên làm trước

### Ưu tiên 0: Auth và user nền tảng

| Method | Endpoint | Lý do |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Tạo user thật, seed preferences/impact/cart. |
| `POST` | `/api/auth/login` | Lấy JWT cho app. |
| `POST` | `/api/auth/refresh` | Duy trì session mobile. |
| `GET` | `/api/me` | Profile/Home/Profile/Settings đều cần. |
| `PATCH` | `/api/me` | Modal edit profile hiện đã có. |
| `PATCH` | `/api/me/preferences` | Layout/settings cần lưu server-side. |

### Ưu tiên 1: Product catalog để Home/Explore/Detail chạy thật

| Method | Endpoint | Lý do |
| --- | --- | --- |
| `GET` | `/api/categories` | Filter chip từ backend. |
| `GET` | `/api/products` | Home/Explore list, search, pagination. |
| `GET` | `/api/products/:id` | Product Detail. |
| `GET` | `/api/products/expiring-today` | Carousel Home. |
| `POST` | `/api/uploads/product-image` | Admin/seller upload Cloudinary về sau. |

### Ưu tiên 2: Cart và checkout

| Method | Endpoint | Lý do |
| --- | --- | --- |
| `GET` | `/api/cart` | Đồng bộ cart giữa thiết bị và backend. |
| `POST` | `/api/cart/items` | Add to Cart/Product Detail/Saved/Reorder. |
| `PATCH` | `/api/cart/items/:productId` | Quantity stepper. |
| `DELETE` | `/api/cart/items/:productId` | Remove item. |
| `DELETE` | `/api/cart` | Clear all. |
| `POST` | `/api/checkout` | Tạo order thật, update stock/impact. |

### Ưu tiên 3: Saved, orders, notifications

| Method | Endpoint | Lý do |
| --- | --- | --- |
| `GET` | `/api/saved-products` | Saved Items screen. |
| `POST` | `/api/saved-products` | Heart product. |
| `DELETE` | `/api/saved-products/:productId` | Unsave/remove. |
| `GET` | `/api/orders` | Order History. |
| `GET` | `/api/orders/:id` | Order Detail. |
| `POST` | `/api/orders/:id/reorder` | Order Again. |
| `GET` | `/api/notifications` | Notifications tab + badge. |
| `PATCH` | `/api/notifications/:id/read` | Mark read. |
| `PATCH` | `/api/notifications/read-all` | Mark all read. |
| `DELETE` | `/api/notifications/:id` | Swipe delete. |

### Ưu tiên 4: Nice-to-have cho polish

| Method | Endpoint | Lý do |
| --- | --- | --- |
| `GET` | `/api/recommendations/products` | AI picks thay local heuristic. |
| `GET` | `/api/search/recent` | Recent search đồng bộ user. |
| `GET` | `/api/me/badges` | Eco badges thật. |
| `GET` | `/api/help/faqs` | Help content quản lý từ backend. |
| `GET` | `/api/content/about` | About content/CMS nhẹ. |
| `POST` | `/api/support/tickets` | Support flow thật. |

## 7. Gợi ý response chuẩn chung

Nên thống nhất response REST để FE dễ xử lý:

```json
{
  "data": {},
  "message": "OK",
  "meta": {
    "requestId": "req_123"
  }
}
```

Với list:

```json
{
  "data": {
    "items": [],
    "page": 1,
    "limit": 10,
    "total": 42,
    "hasMore": true
  }
}
```

Với error:

```json
{
  "error": {
    "code": "PRODUCT_OUT_OF_STOCK",
    "message": "Product is out of stock",
    "details": {}
  }
}
```

JWT nên gửi qua header:

```http
Authorization: Bearer <accessToken>
```

## 8. Ghi chú triển khai Cloudinary

- FE không upload trực tiếp lên Supabase Storage.
- Backend Express nhận multipart file bằng middleware như `multer`.
- Backend upload lên Cloudinary, nhận `secure_url` và `public_id`.
- PostgreSQL chỉ lưu `avatarUrl`, `imageUrl`, `cloudinaryPublicId`.
- API upload tối thiểu:
  - `POST /api/uploads/avatar`
  - `POST /api/uploads/product-image`
  - `POST /api/uploads/seller-avatar`

