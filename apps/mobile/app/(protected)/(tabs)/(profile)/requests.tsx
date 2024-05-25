import HeaderContainer from "@/app/_header";
import { H1 } from "@/components/ui/typography";
import { router } from "expo-router";
import { View } from "react-native";

export default function Page() {
  return (
    <HeaderContainer router={router}>
      <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
        <H1 className="text-center">Ritiri Richiesti</H1>
      </View>
    </HeaderContainer>
  );
}
