import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <View>
      <Svg
        width={props.width}
        height={props.height}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        color={props.color}
      >
        <Path
          d="M8 2V5"
          stroke={props.color}
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M16 2V5"
          stroke={props.color}
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M3.5 9.08997H20.5"
          stroke={props.color}
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
          stroke={props.color}
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M15.6947 13.7H15.7037"
          stroke={props.color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M15.6947 16.7H15.7037"
          stroke={props.color}
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M11.9955 13.7H12.0045"
          stroke={props.color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M11.9955 16.7H12.0045"
          stroke={props.color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M8.29431 13.7H8.30329"
          stroke={props.color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M8.29431 16.7H8.30329"
          stroke={props.color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
    </View>
  );
}
