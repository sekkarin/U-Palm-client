import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

import TanStackProvider from "@/providers/TanstackProvider";
import StoreProvider from "../providers/StoreProvider";
import { AuthProvider } from "@/contexts/AuthProvider";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  display: "auto",
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
      <body className={prompt.className}>
        <StoreProvider>
          <TanStackProvider>
            <AuthProvider>{children}</AuthProvider>
          </TanStackProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
