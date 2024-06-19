import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, View } from "react-native";
import { api } from "@/lib/api";
import { SafeAreaView } from "@/components/safe-area-view";
import { useSupabase } from "@/context/supabase-provider";
import { useEffect, useState } from "react";
import HeaderContainer from "@/app/_header";

export default function Page() {
  const { id } = useLocalSearchParams();
  const { isLoading, data } = api.user.getUserReportRequest.useQuery({ id });
  const { getReportImageUrl } = useSupabase();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      data?.images.map(async (image) => {
        const url = await getReportImageUrl(image);
        setImageUrls([...imageUrls, url]);
      });
    })();
  }, [isLoading]);

  if (isLoading || imageUrls.length === 0) {
    <SafeAreaView>
      <ActivityIndicator size="large" color="#0000ff" />;
    </SafeAreaView>;
  } else
    return (
      <HeaderContainer modal={true}>
        <View className="p-3 flex gap-5">
          <View className="flex gap-2">
            <Text className="text-2xl text-gray-600">Indirizzo</Text>
            <Text className="text-2xl">{data?.address}</Text>
          </View>
          <View className="flex gap-2">
            <Text className="text-2xl text-gray-600">Tipo Rifiuto</Text>
            <Text className="text-2xl">{data?.type}</Text>
          </View>
          <View className="flex flex-col gap-2 w-full">
            {imageUrls.map((image) => {
              return (
                <Image
                  key={image}
                  source={{ uri: image }}
                  style={{ width: 110, height: 110, borderRadius: 8 }}
                  className="h-32 w-32 rounded-lg"
                />
              );
            })}
          </View>
        </View>
      </HeaderContainer>
    );
}
