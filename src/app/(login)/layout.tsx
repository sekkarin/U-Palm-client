import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TanStackProvider from "@/providers/TanstackProvider";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: "100",
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
    <html lang="th">
      <body className={prompt.className}>{children}</body>
    </html>
  );
}
