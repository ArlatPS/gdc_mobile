export const theme = {
  night: "#131112",
  red: "#FF0303",
  grey: "#60656F",
  blue: "#279AF1",
  white: "#F7F7FF",
};

import { StyleSheet } from "react-native";
export const generalStyles = StyleSheet.create({
  headerForSection: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 2,
    fontFamily: "Orienta",
    color: theme.white,
  },
  prompt: {
    fontFamily: "Prompt",
  },
});
