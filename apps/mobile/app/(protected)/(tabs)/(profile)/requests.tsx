import HeaderContainer from "@/app/_header";
import { api } from "@/lib/api";
import { Href, router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSupabase } from "@/context/supabase-provider";
import { useEffect, useState } from "react";
import { italianTimeFormat } from "./assistance";

const RequestTypes = [
  { label: "RAEE", value: "RAEE-1" },
  {
    label: "Pannolini e Pannoloni",
    value: "Pannolini-Pannoloni",
  },
  {
    label: "Sfalci di Potatura",
    value: "Sfalci-di-Potatura",
  },
];

const StatusComponent = ({ status }: { status: string }) => {
  switch (status) {
    case "pending":
      return (
        <View className="flex items-center justify-center p-3 bg-yellow-500/20 rounded-2xl">
          <Text className="font-normal text-yellow-900 text-md ">
            In attesa
          </Text>
        </View>
      );
    case "accepted":
      return (
        <Text className="pl-2 font-normal text-green-500 text-md">
          Accettata
        </Text>
      );
    case "rejected":
      return (
        <Text className="pl-2 font-normal text-red-500 text-md">Rifiutata</Text>
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
    otherSpecs: string | null;
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
        <ActivityIndicator className="items-center justify-center flex-1 bg-background" />
      </HeaderContainer>
    );
  } else
    return (
      <Pressable
        key={request.id}
        onPress={() =>
          request.customRoute
            ? router.push(request.customRoute as Href)
            : router.push(("/(profile)/reqid?id=" + request.id) as Href)
        }
        className="flex-col justify-center w-[100%] gap-2 bg-white border-2 border-gray-300 min-h-20 rounded-2xl"
      >
        <View className="flex flex-row items-center justify-between mx-2">
          <View>
            <Text className="pl-2 text-2xl font-medium">
              Ritiro {"#" + number}
            </Text>
            <View className="flex flex-row items-center justify-center gap-1">
              <Text className="pl-2 font-normal text-gray-500 text-md">
                {
                  RequestTypes.find((type) => type.value === request.type)
                    ?.label ?? request.otherSpecs
                }
              </Text>
              <Text className="pl-2 font-bold">-</Text>
              <Text className="pl-1 font-normal text-gray-500 text-md">
                {italianTimeFormat(request.createdAt)}
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center justify-start gap-2">
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
        <ActivityIndicator className="items-center justify-center flex-1 bg-background" />
      </HeaderContainer>
    );
  } else if (requests?.length === 0) {
    return (
      <HeaderContainer router={router}>
        <View className="items-center justify-center flex-1 p-4 bg-background gap-y-4">
          <Text className="text-2xl font-bold text-gray-500">
            Nessuna richiesta
          </Text>
        </View>
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <ScrollView>
          <View className="items-start justify-start flex-1 p-4 pb-40 mt-4 bg-background gap-y-4">
            <View className="flex w-full gap-2">
              {requests?.map((requests, index) => (
                <RequestComponent
                  request={requests}
                  number={index}
                  key={index}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </HeaderContainer>
    );
}
