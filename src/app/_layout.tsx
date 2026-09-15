import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="details"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: [0.5, 0.7, 1],
            sheetInitialDetentIndex: 1,
            sheetCornerRadius: 32,
            sheetGrabberVisible: true,
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
