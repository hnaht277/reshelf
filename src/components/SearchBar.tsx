import { Search, X } from "lucide-react-native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { colors, radius, spacing, type } from "@/constants/theme";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search for rescued products..."
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Search size={20} color={colors.neutral[400]} strokeWidth={1.5} />
      <TextInput
        accessibilityLabel="Search products"
        autoCapitalize="none"
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[300]}
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable accessibilityLabel="Clear search" accessibilityRole="button" onPress={() => onChange("")}>
          <X size={20} color={colors.neutral[400]} strokeWidth={1.5} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing.md
  },
  input: {
    flex: 1,
    color: colors.neutral[700],
    ...type.bodyMd
  }
});
