import { Text } from "@/components/ui/text";
import { Muted } from "@/components/ui/typography";
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
import { router, useLocalSearchParams } from "expo-router";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

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
      const url = await getProductImageUrl(product.images[0], product.cityid);
      console.log(url);
      setImageUrl(url);
    })();
  }, []);
  if (imageUrl === "") {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else {
    return (
      <Pressable
        className="bg-white rounded-2xl shadow-lg w-[90%] mx-5 flex gap-2 pb-5"
        onPress={() =>
          product.customRoute
            ? router.push(product.customRoute)
            : router.push(`/(shop)/${product.id}`)
        }
      >
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-52 rounded-t-2xl"
          resizeMode="cover"
        />
        <Text className="font-medium text-xl pl-4">{product.name}</Text>
        <Text className="font-light text-md pl-4">
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
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else if (data?.length === 0) {
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
          <Muted className="text-center">
            Nessun prodotto attualmente caricato.{" "}
          </Muted>
        </View>
      </HeaderContainer>
    );
  } else {
    return (
      <HeaderContainer router={router}>
        <ScrollView
          snapToStart
          className="h-full pt-10"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={OnRefresh} />
          }
        >
          <View className="flex-1 pb-44 items-center justify-start bg-background gap-y-4 mt-3">
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
          </View>
        </ScrollView>
      </HeaderContainer>
    );
  }
}
