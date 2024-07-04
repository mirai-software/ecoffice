import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, View } from "react-native";
import { api } from "@/lib/api";
import { SafeAreaView } from "@/components/safe-area-view";
import { useSupabase } from "@/context/supabase-provider";
import { useEffect, useState } from "react";
import HeaderContainer from "@/app/_header";

const StatusComponent = ({
  status,
}: {
  status: "pending" | "accepted" | "rejected";
}) => {
  switch (status) {
    case "pending":
      return (
        <View className="bg-yellow-500/40 p-3 flex items-center justify-center rounded-2xl">
          <Text className="font-normal text-md text-yellow-900 ">
            In attesa
          </Text>
        </View>
      );
    case "accepted":
      return (
        <Text className="font-normal text-md pl-2 text-green-500">
          Accettata
        </Text>
      );
    case "rejected":
      return (
        <Text className="font-normal text-md pl-2 text-red-500">Rifiutata</Text>
      );
  }
};

export default function Page() {
  const { id } = useLocalSearchParams();
  const { isLoading, data } = api.user.getUserPickupRequest.useQuery({
    id: id as string,
  });
  const { getRequestImageUrl } = useSupabase();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      data?.images.map(async (image) => {
        const url = await getRequestImageUrl(image);
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
          <View className="flex gap-2">
            <Text className="text-2xl text-gray-600">Numero di Telefono</Text>
            <Text className="text-2xl">{data?.user.phone}</Text>
          </View>
          <View className="flex gap-2">
            <Text className="text-2xl text-gray-600">Stato</Text>
            <StatusComponent status={data?.status ?? "pending"} />
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
