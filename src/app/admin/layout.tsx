import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "U Palm shopping",
  description: "E commercial shopping no.1 in Thailand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
