import HeaderBackground from "@/assets/HeaderBackground";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import { canGoBack, getTitle } from "@/lib/utils";
import React, { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { ExpoRouter } from "expo-router/types/expo-router";

interface ContainerWithChildrenProps {
  children: ReactNode;
  router?: ExpoRouter.Router;
  modal?: boolean;
  rightComponent?: ReactNode;
}

const HeaderContainer: React.FC<ContainerWithChildrenProps> = ({
  children,
  router,
  modal = false,
  rightComponent,
}) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <View
        className="bg-white"
        style={{
          position: "relative",
          paddingTop: insets.top - 50,
          alignItems: "center",
        }}
      >
        <HeaderBackground />
        <Text
          className="text-black"
          style={{
            position: "absolute",
            top: "55%",
            fontSize: 22,
            fontWeight: "semibold",
            zIndex: 1,
          }}
        >
          {getTitle({
            name: route.name,
          })}
        </Text>
        {canGoBack(route.name) && !modal && router && (
          <View
            style={{
              position: "absolute",
              top: insets.top,
              left: 20,
              zIndex: 1,
            }}
          >
            <Pressable
              className=" rounded-full p-3"
              onPress={() => router.back()}
            >
              <FontAwesome name="angle-left" size={24} color="black" />
            </Pressable>
          </View>
        )}

        {rightComponent && (
          <View
            style={{
              position: "absolute",
              top: insets.top,
              right: 20,
              zIndex: 1,
            }}
          >
            {rightComponent}
          </View>
        )}
      </View>
      {children}
    </View>
  );
};

export default HeaderContainer;
