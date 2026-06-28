import type { FreshnessStatus } from "@/types";

export const colors = {
  primary: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    900: "#14532D"
  },
  neutral: {
    0: "#FFFFFF",
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717"
  },
  success: "#22C55E",
  successLight: "#F0FDF4",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  info: "#3B82F6",
  infoLight: "#EFF6FF",
  impact: "#8B5CF6",
  impactLight: "#F5F3FF"
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  full: 9999
} as const;

export const type = {
  displayLg: { fontSize: 32, lineHeight: 40, fontFamily: "Outfit_700Bold" },
  displayMd: { fontSize: 28, lineHeight: 36, fontFamily: "Outfit_700Bold" },
  headingLg: { fontSize: 24, lineHeight: 32, fontFamily: "Outfit_600SemiBold" },
  headingMd: { fontSize: 20, lineHeight: 28, fontFamily: "Outfit_600SemiBold" },
  headingSm: { fontSize: 18, lineHeight: 24, fontFamily: "Outfit_600SemiBold" },
  bodyLg: { fontSize: 16, lineHeight: 24, fontFamily: "Inter_400Regular" },
  bodyMd: { fontSize: 14, lineHeight: 20, fontFamily: "Inter_400Regular" },
  bodySm: { fontSize: 12, lineHeight: 16, fontFamily: "Inter_500Medium" },
  badge: { fontSize: 11, lineHeight: 14, fontFamily: "Inter_600SemiBold" },
  priceLg: { fontSize: 24, lineHeight: 32, fontFamily: "Inter_700Bold" }
} as const;

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1
  },
  md: {
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  lg: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6
  },
  xl: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 20 },
    elevation: 9
  }
} as const;

export const categories = [
  "All",
  "Food",
  "Beverages",
  "Dairy",
  "Bakery",
  "Personal Care",
  "Household"
] as const;

export const freshnessStyles: Record<
  FreshnessStatus,
  { bg: string; text: string; border: string }
> = {
  Fresh: { bg: colors.successLight, text: colors.primary[600], border: colors.primary[200] },
  "Expiring Soon": { bg: colors.warningLight, text: "#D97706", border: "#FDE68A" },
  "Last Day": { bg: colors.dangerLight, text: "#DC2626", border: "#FECACA" },
  Expired: { bg: colors.neutral[100], text: colors.neutral[400], border: colors.neutral[200] }
};
