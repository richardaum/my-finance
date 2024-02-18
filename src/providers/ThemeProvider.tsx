import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="auto" theme={{ fontFamily: "Lato" }}>
      <Notifications />
      {children}
    </MantineProvider>
  );
}
