import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

import TanStackProvider from "@/providers/TanstackProvider";
import StoreProvider from "../providers/StoreProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import theme from "@/theme";
import { ThemeProvider } from "@mui/material";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  // style: ["normal"],
  // display: "auto",
});

export const metadata: Metadata = {
  title: "U Palm shopping",
  description: "E commercial shopping no.1 in Thailand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning={true}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={prompt.className}>
        <StoreProvider>
          <TanStackProvider>
            <ThemeProvider theme={theme}>
              <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
          </TanStackProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
