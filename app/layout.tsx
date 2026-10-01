import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aarti Trading Catalogue",
  description: "Browse the Aarti Trading product catalogue.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
