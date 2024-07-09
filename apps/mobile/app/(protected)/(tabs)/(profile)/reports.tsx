import HeaderContainer from "@/app/_header";

import { api } from "@/lib/api";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSupabase } from "@/context/supabase-provider";
import { useEffect, useState } from "react";
import { italianTimeFormat } from "./assistance";

const ReportComponent = ({
  report,
  number,
}: {
  report: {
    id: string;
    address: string;
    type: string;
    status: string;
    images: string[];
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  number: number;
}) => {
  const { getReportImageUrl } = useSupabase();
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    (async () => {
      const url = await getReportImageUrl(report.images[0]);
      console;
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
        key={report.id}
        onPress={() => router.push("/(profile)/repid?id=" + report.id)}
        className="bg-white flex-row gap-2 pb-5 border-b-2 border-gray-300 w-full"
      >
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            className="h-24 w-20  bg-gray-500/10"
            resizeMode="cover"
          />
        )}
        <View className="flex flex-col gap-2">
          <Text className="font-medium text-2xl pl-2">
            Segnalazione {"#" + number}
          </Text>
          <View className="flex flex-row gap-1 justify-center items-center">
            <Text className="font-normal text-md pl-2">{report.type}</Text>
            <Text className="pl-2 font-bold">-</Text>
            <Text className="font-normal text-md pl-2">
              {report.address.length > 20
                ? report.address.substring(0, 20) + "..."
                : report.address}
            </Text>
          </View>
          <Text className="font-normal text-md pl-2 text-gray-500">
            {italianTimeFormat(report.createdAt)}
          </Text>
        </View>
      </Pressable>
    );
};

export default function Page() {
  const { data: reports, isLoading } =
    api.user.getUserReportRequests.useQuery();

  if (isLoading) {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else if (reports?.length === 0) {
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
          <Text className="text-2xl font-bold text-gray-500">
            Nessuna Segnalazione
          </Text>
        </View>
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <ScrollView>
          <View className="flex-1 items-start justify-start bg-background p-4 gap-y-4 mt-4 pb-40">
            <View className="flex gap-2 w-full">
              {reports?.map((report, index) => (
                <ReportComponent
                  report={report}
                  number={index}
                  key={report.id}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </HeaderContainer>
    );
}
