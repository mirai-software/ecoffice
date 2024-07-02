import HeaderContainer from "@/app/_header";
import { H1, H3, Muted } from "@/components/ui/typography";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { api } from "@/lib/api";
import { Image } from "react-native";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import { toast } from "@backpackapp-io/react-native-toast";

export function italianTimeFormat(dateUTC) {
  if (dateUTC) {
    const jsDateFormat = new Date(dateUTC);
    const fullStringTime = {
      day: Number(jsDateFormat.getDate() < 10)
        ? "0" + jsDateFormat.getDate()
        : jsDateFormat.getDate(),
      month:
        Number(jsDateFormat.getMonth() + 1) < 10
          ? "0" + (jsDateFormat.getMonth() + 1)
          : jsDateFormat.getMonth() + 1,
      year: jsDateFormat.getFullYear(),
      hours:
        Number(jsDateFormat.getHours()) < 10
          ? "0" + jsDateFormat.getHours()
          : jsDateFormat.getHours(),
      minutes:
        Number(jsDateFormat.getMinutes()) < 10
          ? "0" + jsDateFormat.getMinutes()
          : jsDateFormat.getMinutes(),
    };
    return (
      fullStringTime.day +
      "/" +
      fullStringTime.month +
      "/" +
      fullStringTime.year +
      " " +
      fullStringTime.hours +
      ":" +
      fullStringTime.minutes
    );
  }
  return null;
}

export default function Page() {
  const CreateFirstMessage = api.user.CreateSupportRequest.useMutation();
  const SendMessage = api.user.AddMessageToSupportRequest.useMutation();
  const CloseRequest = api.user.closeSupportRequest.useMutation();
  const utils = api.useUtils();

  const { isLoading, data, error } =
    api.user.getActiveSupportRequest.useQuery();

  const SendMessageToSupportRequest = () => {
    SendMessage.mutate({
      message: Message,
    });
    utils.user.getActiveSupportRequest.invalidate();
    router.back();
    toast.success("il Tuo messaggio è stato inoltrato al nostro team", {
      styles: {
        view: {
          backgroundColor: "#00930F",
          borderRadius: 8,
        },
        indicator: {
          backgroundColor: "white",
        },
      },
    });
  };

  // This function is called when the user sends the first message
  const OnFirstMessageSend = () => {
    CreateFirstMessage.mutate({
      messages: FirstMessage,
    });
    utils.user.getActiveSupportRequest.invalidate();
    router.back();
    toast.success(
      "La richiesta di Assistenza è stata inoltrata al nostro team",
      {
        styles: {
          view: {
            backgroundColor: "#00930F",
            borderRadius: 8,
          },
          indicator: {
            backgroundColor: "white",
          },
        },
      }
    );
  };

  const OnCloseRequest = () => {
    CloseRequest.mutate({
      id: data![0].id,
    });
    utils.user.getActiveSupportRequest.invalidate();
    router.back();
    toast.success("Richiesta di assistenza chiusa", {
      styles: {
        view: {
          backgroundColor: "#00930F",
          borderRadius: 8,
        },
        indicator: {
          backgroundColor: "white",
        },
      },
    });
  };

  const [FirstMessage, setFirstMessage] = useState("");
  const [Message, setMessage] = useState("");

  if (isLoading) {
    return (
      <HeaderContainer router={router}>
        <ActivityIndicator className="flex-1 justify-center items-center bg-background" />
      </HeaderContainer>
    );
  } else if (data?.length === 0) {
    return (
      <HeaderContainer router={router}>
        <View className="flex-1 items-center justify-start mt-10 bg-background p-4 gap-y-4">
          <Image
            source={require("../../../../assets/AssistanceImage.png")}
            style={{ width: 180, height: 180 }}
          />
          <H3 className="text-center">Come Possiamo aiutarti?</H3>
          <Muted className="text-center text-md">
            Il nostro team prenderà in carico la tua richiesta il prima
            possibile. Puoi uscire da questa schermata, ti invieremo una
            notifica appena avrai ricevuto risposta.
          </Muted>
          <View className="flex flex-row w-full items-center gap-2">
            <TextInput
              placeholder="Scrivi qui la tua richiesta"
              value={FirstMessage}
              onChangeText={(text) => setFirstMessage(text)}
              className="border-2 rounded-xl p-3 border-gray-400 flex-1"
            />
            <Pressable
              className="bg-primary rounded-xl p-2 disabled:bg-gray-400 disabled:opacity-50"
              disabled={FirstMessage === ""}
              onPress={OnFirstMessageSend}
            >
              <H3 className="text-center text-white">Invia</H3>
            </Pressable>
          </View>
        </View>
      </HeaderContainer>
    );
  } else
    return (
      <HeaderContainer router={router}>
        <ScrollView>
          <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
            {data![0].messages.map((message, index) => (
              <View
                key={message.id}
                className={`w-full flex gap-2 border-b-2 border-gray-200 pb-3`}
              >
                <View className="flex flex-row justify-between">
                  <Text className="text-gray-400">
                    {message.userId == data![0].userId
                      ? "La tua Richiesta"
                      : "Admin"}
                  </Text>
                  <View className="flex flex-row justify-center items-center gap-2">
                    <Text className="text-gray-400 text-sm">
                      {italianTimeFormat(message.createdAt)}
                    </Text>
                    {index === data![0].messages.length - 1 && (
                      <View className="rounded-2xl bg-[#334493] flex justify-center items-center p-1">
                        <Text className="text-sm   text-white ">Nuovo</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text>{message.content}</Text>
              </View>
            ))}

            <View className="flex flex-row w-full items-center gap-2">
              <TextInput
                placeholder="Rispondi"
                value={Message}
                onChangeText={(text) => setMessage(text)}
                className="border-2 rounded-xl p-3 border-gray-400 flex-1"
              />
              <Pressable
                className="bg-primary rounded-xl p-2 disabled:bg-gray-400 disabled:opacity-50"
                disabled={Message === ""}
                onPress={SendMessageToSupportRequest}
              >
                <H3 className="text-center text-white">Invia</H3>
              </Pressable>
            </View>
            <Pressable
              className="w-full flex items-center bg-[#334493] p-3 rounded-2xl mb-40"
              onPress={OnCloseRequest}
            >
              <Text className="font-semibold text-white">
                Contrassegna come Risolto
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </HeaderContainer>
    );
}
