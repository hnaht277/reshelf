Backend của hệ thống được xây dựng bằng Node.js và Express, đóng vai trò là API server trung gian giữa mobile app và các dịch vụ dữ liệu. Backend chịu trách nhiệm xử lý các chức năng chính như quản lý người dùng, cửa hàng, sản phẩm cận date, giỏ hàng, đơn hàng và hệ thống gợi ý sản phẩm bằng AI.

Dữ liệu có cấu trúc như thông tin người dùng, cửa hàng, sản phẩm, hạn sử dụng, giá giảm, đơn hàng và lịch sử mua hàng được lưu trữ trong Supabase PostgreSQL. Prisma ORM được sử dụng để thao tác với cơ sở dữ liệu, giúp việc tạo, đọc, cập nhật và truy vấn dữ liệu nhanh hơn, giảm thời gian viết SQL thủ công.

Đối với hình ảnh sản phẩm và cửa hàng, hệ thống sử dụng Cloudinary để lưu trữ và quản lý ảnh. Khi người bán đăng sản phẩm cận date, backend sẽ nhận ảnh, upload lên Cloudinary và lưu URL ảnh vào database. Cách này giúp database nhẹ hơn và frontend có thể tải ảnh nhanh, ổn định hơn.

Tính năng AI recommendation được xử lý ở backend bằng cách kết hợp dữ liệu người dùng, vị trí, lịch sử mua hàng, sản phẩm còn hạn ngắn, mức giảm giá và khoảng cách đến cửa hàng. Backend sẽ tính điểm phù hợp cho từng sản phẩm hoặc combo, sau đó trả về danh sách gợi ý cá nhân hóa cho người dùng. Nếu cần, hệ thống có thể gọi thêm AI API để tạo lời giải thích ngắn gọn cho từng gợi ý.

Backend được thiết kế theo hướng đơn giản, dễ triển khai trong thời gian hackathon: mobile app gọi REST API, backend xử lý business logic, Supabase lưu dữ liệu, Cloudinary lưu ảnh, và AI hỗ trợ cá nhân hóa gợi ý. Cách triển khai này giúp sản phẩm có thể demo nhanh nhưng vẫn có kiến trúc đủ thực tế để mở rộng sau này.
