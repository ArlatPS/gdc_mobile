import { Image } from "react-native";

export default function TabBarHomeIcon({ size }: { size: number }) {
  return (
    <Image
      source={require("../../assets/gdclog.png")}
      style={{ height: size, aspectRatio: 1 }}
    />
  );
}
