import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "PutMeOn!" }} />
      <Stack.Screen name="music" options={{ title: "Listen page" }} />
      <Stack.Screen name="actions" options={{ title: "Post Log In" }} />
      <Stack.Screen name="suggestion" options={{ title: "Post Log In" }} />
      <Stack.Screen
        name="modal/login"
        options={{
          presentation: "modal",
          title: "Login / Sign Up",
        }}
      />
    </Stack>
  );
}
