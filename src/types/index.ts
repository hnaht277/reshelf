import type { NavigatorScreenParams } from "@react-navigation/native";

export type Category =
  | "All"
  | "Personal Care"
  | "Household";

export type FreshnessStatus = "Fresh" | "Expiring Soon" | "Last Day" | "Expired";

export type Seller = {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  distanceKm: number;
  verified: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  expiryDate: string;
  category: Exclude<Category, "All">;
  seller: Seller;
  imageUrl: string;
  stock: number;
  co2Savings: number;
  description: string;
  reason: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type NotificationType =
  | "new-listing"
  | "price-drop"
  | "expiry-alert"
  | "order-update"
  | "impact";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type CheckoutResult = {
  orderId: string;
  itemsRescued: number;
  co2Saved: number;
  total: number;
};

export type OrderStatus = "ready" | "delivered" | "cancelled";

export type Order = {
  id: string;
  placedAt: string;
  status: OrderStatus;
  items: CartItem[];
  total: number;
  co2Saved: number;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  ProductDetail: { productId: string };
  Checkout: undefined;
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
  SavedItems: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
};

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Cart: undefined;
  Notifications: undefined;
  Profile: undefined;
};
