import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Bell, Home, Search, ShoppingCart, User } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows, type } from "@/constants/theme";
import { CartScreen } from "@/screens/CartScreen";
import { ExploreScreen } from "@/screens/ExploreScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { NotificationsScreen } from "@/screens/NotificationsScreen";
import { ProductDetailScreen } from "@/screens/ProductDetailScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { useCartStore } from "@/store/useCartStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import type { RootStackParamList, TabParamList } from "@/types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={Tabs} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Tabs() {
  const itemCount = useCartStore((state) => state.itemCount());
  const unreadCount = useNotificationStore((state) => state.unreadCount());

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary[700],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          const Icon = routeIcons[route.name];
          return (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <Icon color={color} size={26} strokeWidth={focused ? 2 : 1.5} />
              {route.name === "Cart" && itemCount > 0 ? <BadgeCount count={itemCount} /> : null}
              {route.name === "Notifications" && unreadCount > 0 ? (
                <BadgeCount count={unreadCount} />
              ) : null}
              {route.name === "Profile" ? <View style={styles.badgeDot} /> : null}
            </View>
          );
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const routeIcons = {
  Home,
  Explore: Search,
  Cart: ShoppingCart,
  Notifications: Bell,
  Profile: User
};

function BadgeCount({ count }: { count: number }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    minHeight: 72,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 0,
    borderTopLeftRadius: radius["2xl"],
    borderTopRightRadius: radius["2xl"],
    backgroundColor: colors.neutral[0],
    ...shadows.xl
  },
  tabLabel: {
    ...type.badge
  },
  iconWrap: {
    minWidth: 44,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center"
  },
  activeIconWrap: {
    transform: [{ scale: 1.08 }]
  },
  badge: {
    position: "absolute",
    right: 0,
    top: -4,
    minWidth: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4
  },
  badgeText: {
    ...type.badge,
    color: colors.neutral[0],
    fontSize: 10
  },
  badgeDot: {
    position: "absolute",
    right: 5,
    top: 0,
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.impact
  }
});
