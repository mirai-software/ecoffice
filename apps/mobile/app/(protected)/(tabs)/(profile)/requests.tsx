import HeaderContainer from "@/app/_header";
import { api } from "@/lib/api";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSupabase } from "@/context/supabase-provider";
import { useEffect, useState } from "react";
import { italianTimeFormat } from "./assistance";

const StatusComponent = ({
  status,
}: {
  status: "pending" | "accepted" | "rejected";
}) => {
  switch (status) {
    case "pending":
      return (
        <View className="bg-yellow-500/20 p-3 flex items-center justify-center rounded-2xl">
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

export const RequestComponent = ({
  request,
  number,
}: {
  request: {
    id: string;
    address: string;
    type: string;
    status: string;
    images: string[];
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    customRoute?: string;
  };
  number: number;
}) => {
  const { getRequestImageUrl } = useSupabase();
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    (async () => {
      const url = await getRequestImageUrl(request.images[0]);
      setImageUrl(url);
    })();
  }, []);
  if (imageUrl === "") {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else
    return (
      <Pressable
        key={request.id}
        onPress={() =>
          request.customRoute
            ? router.push(request.customRoute)
            : router.push("/(profile)/reqid?id=" + request.id)
        }
        className="bg-white flex-col gap-2 min-h-20 justify-center border-2 rounded-2xl border-gray-300 w-full"
      >
        <View className="flex flex-row justify-between mx-2 items-center">
          <View>
            <Text className="font-medium text-2xl pl-2">
              Ritiro {"#" + number}
            </Text>
            <View className="flex flex-row gap-1 justify-center items-center">
              <Text className="font-normal text-md pl-2 text-gray-500">
                {request.type}
              </Text>
              <Text className="pl-2 font-bold">-</Text>
              <Text className="font-normal text-md pl-1 text-gray-500">
                {italianTimeFormat(request.createdAt)}
              </Text>
            </View>
          </View>

          <View className="flex flex-row gap-2 justify-start items-center">
            <StatusComponent status={request.status} />
          </View>
        </View>
      </Pressable>
    );
};

export default function Page() {
  const { data: requests, isLoading } =
    api.user.getUserPickupRequests.useQuery();

  if (isLoading) {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else if (requests?.length === 0) {
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
          <Text className="text-2xl font-bold text-gray-500">
            Nessuna richiesta
          </Text>
        </View>
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-start justify-start bg-background p-4 gap-y-4 mt-4">
          <View className="flex gap-2 w-full">
            {requests?.map((requests, index) => (
              <RequestComponent request={requests} number={index} key={index} />
            ))}
          </View>
        </View>
      </HeaderContainer>
    );
}
