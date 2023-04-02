import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../theme";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; //26

// it will need Suspense with good fallback
export default function NameEffect({ text }: { text: string }) {
  const [textDisplayed, setTextDisplayed] = useState("");
  useEffect(() => {
    // start showing real letters after small delay
    let iteration = -2;
    //interval for changing text
    const interval = setInterval(() => {
      const output: string[] = [];
      text
        .toUpperCase()
        .split("")
        .map((letter, index) => {
          // if index smaller then current iteration display real letter
          if (index < iteration) {
            output.push(letter);
            // otherwise display random letter
          } else {
            output.push(LETTERS[Math.floor(Math.random() * 26)]);
          }
        });
      iteration += 0.6;
      setTextDisplayed(output.join(""));
      // if all needed iterations done - clearInterval
      if (iteration > text.length) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 30,
          textAlign: "center",
          fontFamily: "SpaceMono",
          color: theme.white,
        }}
      >
        {textDisplayed}
      </Text>
    </View>
  );
}
