import type { AppNotification } from "@/types";

const hour = 60 * 60 * 1000;
const day = 24 * hour;

export const notifications: AppNotification[] = [
  {
    id: "n-001",
    type: "new-listing",
    title: "Có túi thực phẩm mới gần bạn",
    body: "Bách Hóa Xanh Nguyễn Trãi vừa thêm 3 phần rau củ chín tới trong bán kính 1 km.",
    createdAt: new Date(Date.now() - 2 * hour).toISOString(),
    read: false
  },
  {
    id: "n-002",
    type: "expiry-alert",
    title: "Sản phẩm đã lưu hết hạn vào ngày mai",
    body: "Nước cam ép nguyên chất 500 ml vẫn còn hàng nhưng chỉ trong thời gian ngắn.",
    createdAt: new Date(Date.now() - 5 * hour).toISOString(),
    read: false
  },
  {
    id: "n-003",
    type: "price-drop",
    title: "Sữa chua vừa giảm giá",
    body: "Lốc 4 hộp sữa chua có đường đang giảm 39% tại Nhà Sữa Việt.",
    createdAt: new Date(Date.now() - 22 * hour).toISOString(),
    read: true
  },
  {
    id: "n-004",
    type: "order-update",
    title: "Đã xác nhận giờ nhận hàng",
    body: "Đơn hàng tại Tiệm Bánh Cô Ba có thể được nhận từ 17:00 đến 19:00.",
    createdAt: new Date(Date.now() - day - 2 * hour).toISOString(),
    read: true
  },
  {
    id: "n-005",
    type: "impact",
    title: "Bạn vừa đạt một cột mốc",
    body: "Bạn đã giải cứu 12 phần thực phẩm và giảm 4,8 kg CO2 đến thời điểm này.",
    createdAt: new Date(Date.now() - 4 * day).toISOString(),
    read: false
  }
];
