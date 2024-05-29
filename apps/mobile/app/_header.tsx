import HeaderBackground from "@/assets/HeaderBackground";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import { canGoBack, getTitle } from "@/lib/utils";
import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import { ExpoRouter } from "expo-router/types/expo-router";

interface ContainerWithChildrenProps {
  children: ReactNode;
  router: ExpoRouter.Router;
}

const HeaderContainer: React.FC<ContainerWithChildrenProps> = ({
  children,
  router,
}) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <View
        className="bg-background"
        style={{
          position: "relative",
          paddingTop: insets.top - 50,
          alignItems: "center",
        }}
      >
        <HeaderBackground />
        <Text
          className="dark:text-white text-black"
          style={{
            position: "absolute",
            top: insets.top,
            fontSize: 22,
            fontWeight: "semibold",

            zIndex: 1,
          }}
        >
          {getTitle({
            name: route.name,
          })}
        </Text>
        {canGoBack(route.name) && (
          <View
            style={{
              position: "absolute",
              top: insets.top,
              left: 20,
              zIndex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "semibold",
                color: "#000",
              }}
              onPress={() => router.back()}
            >
              <FontAwesome name="angle-left" size={24} color="black" />
            </Text>
          </View>
        )}
      </View>
      {children}
    </View>
  );
};

export default HeaderContainer;
