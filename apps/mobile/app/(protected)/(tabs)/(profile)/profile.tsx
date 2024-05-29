import HeaderContainer from "@/app/_header";
import { H1 } from "@/components/ui/typography";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { api } from "@/lib/api";
import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";

export default function Page() {
  const { data: user, isLoading } = api.user.getUser.useQuery({});

  if (isLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
          <H1 className="text-center">Il Mio Profilo</H1>
          {/* print the user as json structured */}
          <View>
            <Text>{JSON.stringify(user, null, 2)}</Text>
          </View>
        </View>
      </HeaderContainer>
    );
}
