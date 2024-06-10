import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { ActivityIndicator, Image, Pressable, View } from "react-native";

import { useSupabase } from "@/context/supabase-provider";
import HeaderContainer from "@/app/_header";

import { api } from "@/lib/api";
import { router } from "expo-router";
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
};

const SecondHandProductComponent = (product: secondHandProduct) => {
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
        onPress={() => router.push("(shop)/" + product.id)}
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
  if (isLoading) {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else if (data?.length === 0) {
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-centerjustify-center bg-background p-4 gap-y-4">
          <Muted className="text-center">
            Nessun prodotto attualmente caricato.{" "}
          </Muted>
        </View>
      </HeaderContainer>
    );
  } else {
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-center justify-start bg-background gap-y-4 mt-3">
          {data?.map((product) => (
            <SecondHandProductComponent
              key={product.id}
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
      </HeaderContainer>
    );
  }
}
