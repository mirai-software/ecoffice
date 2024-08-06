import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
import { FadeIn, FadeOut } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  View,
} from "react-native";

import { useSupabase } from "@/context/supabase-provider";
import HeaderContainer from "@/app/_header";

import { api } from "@/lib/api";
import { Href, router, useLocalSearchParams } from "expo-router";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { useEffect, useState } from "react";

type secondHandProduct = {
  id: string;
  name: string;
  cityid: string;
  description: string;
  date: Date;
  price: Float;
  images: string[];
  customRoute?: string;
};

export const SecondHandProductComponent = (product: secondHandProduct) => {
  const { getProductImageUrl } = useSupabase();
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (product.images.length === 0) {
        setImageUrl("null");
        return;
      }
      const url = await getProductImageUrl(product.images[0], product.cityid);
      setImageUrl(url);
    })();
  }, []);
  if (imageUrl === "") {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="items-center justify-center flex-1 bg-background" />
      </HeaderContainer>
    );
  } else {
    return (
      <Pressable
        className="bg-white rounded-2xl border-2 border-gray-300 w-[90%] mx-5 flex gap-2 pb-5"
        onPress={() =>
          product.customRoute
            ? router.push((product.customRoute) as Href)
            : router.push((`/(shop)/${product.id}`) as Href)
        }
      >
        {imageUrl !== "null" ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-52 rounded-t-2xl"
            resizeMode="cover"
          />
        ) : (
          <View className="flex items-center justify-center w-full h-52 rounded-t-2xl">
            <Text className="text-xl font-semibold">Nessuna Immagine</Text>
          </View>
        )}
        <Text className="pl-4 text-xl font-medium">{product.name}</Text>
        <Text className="pl-4 font-light text-md">
          {product.date.toDateString()}
        </Text>
      </Pressable>
    );
  }
};

export default function Shop() {
  const { data, isLoading } = api.city.getAllSecondHandProducts.useQuery({});
  const [refreshing, setRefreshing] = useState(false);
  const { slug } = useLocalSearchParams();
  const utils = api.useUtils();

  if (slug) {
    const product = data?.find((product) => product.id === slug);
    if (product) {
      data?.splice(data?.indexOf(product), 1);
      data?.unshift(product);
    }
  }

  const OnRefresh = () => {
    utils.city.getAllSecondHandProducts.refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="items-center justify-center flex-1 bg-background" />
      </HeaderContainer>
    );
  } else if (data?.length === 0) {
    return (
      <HeaderContainer router={router}>
        <Animated.View
          className="items-center justify-center flex-1 p-4 bg-background gap-y-4"
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Muted className="text-center">
            Nessun prodotto attualmente caricato.{" "}
          </Muted>
        </Animated.View>
      </HeaderContainer>
    );
  } else {
    return (
      <HeaderContainer router={router}>
        <Animated.ScrollView
          entering={FadeIn}
          exiting={FadeOut}
          snapToStart
          className="h-full pt-10"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={OnRefresh} />
          }
        >
          <Animated.View
            className="items-center justify-start flex-1 mt-3 pb-44 bg-background gap-y-4"
            entering={FadeIn}
            exiting={FadeOut}
          >
            {data?.map((product, key) => (
              <SecondHandProductComponent
                key={key}
                name={product.name}
                description={product.description}
                cityid={product.cityId}
                price={product.price}
                date={product.createdAt}
                id={product.id}
                images={product.images}
              />
            ))}
          </Animated.View>
        </Animated.ScrollView>
      </HeaderContainer>
    );
  }
}
