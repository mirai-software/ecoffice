import HeaderContainer from "@/app/_header";

import { H1, Muted } from "@/components/ui/typography";
import { api } from "@/lib/api";

import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useSupabase } from "@/context/supabase-provider";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Image } from "react-native";
import { Text } from "@/components/ui/text";
import PagerView from "react-native-pager-view";

const ImagesComponent = ({ urls }: { urls: string[] }) => {
  if (urls.length === 0) {
    return <ActivityIndicator className="w-full h-72 " />;
  } else
    return (
      <View className="w-full h-72">
        <PagerView style={{ flex: 1 }} initialPage={0}>
          {urls.map((url, index) => (
            <View key={index} className="relative w-full">
              <Image
                source={{ uri: url }}
                className="w-full h-72"
                resizeMode="cover"
              />
              <View className="bg-black/60 absolute bottom-2 right-[42%] px-4 py-2 rounded-xl">
                <Text className="text-white ">
                  {index + 1} di {urls.length}
                </Text>
              </View>
            </View>
          ))}
        </PagerView>
      </View>
    );
};

export default function Page() {
  const { slug } = useLocalSearchParams();
  const { getProductImageUrl } = useSupabase();
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const { data, isLoading } = api.city.getSecondHandProduct.useQuery({
    id: slug as string,
  });

  useEffect(() => {
    (async () => {
      while (isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (data) {
        data.images.map(async (image) => {
          const url = await getProductImageUrl(image, data.city.id);
          setImageUrl((prev) => [...prev, url]);
        });
      }
    })();
  }, [isLoading]);

  if (isLoading) {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else {
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-center justify-start bg-background">
          <ImagesComponent urls={imageUrl} />
          <View className="flex flex-row justify-between w-full">
            <View className="flex flex-col gap-3 pt-4">
              <Text className="font-light text-md pl-4">
                {data?.createdAt.toDateString()}
              </Text>
              <Text className="font-semibold text-2xl pl-4">{data?.name}</Text>
            </View>
            <View className="flex flex-col gap-3 pt-4">
              <Text className="font-light text-md pr-6 text-right">
                ID : {data?.id.slice(0, 6) + "..."}
              </Text>
              <Text className="font-semibold text-2xl pr-6 text-right">
                € {data?.price}
              </Text>
            </View>
          </View>
          <Text className="mt-3 p-2 font-medium text-gray-400">
            {data?.description}
          </Text>
          <Pressable
            className="w-[95%] mt-10 flex items-center bg-green-500 rounded-2xl p-2"
            onPress={() =>
              router.push("https://wa.me/" + data?.city.whatsappNumber)
            }
          >
            <Text className="p-2 font-bold text-white">
              Contattaci su Whatsapp
            </Text>
          </Pressable>
        </View>
      </HeaderContainer>
    );
  }
}
