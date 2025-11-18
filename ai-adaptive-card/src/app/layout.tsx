import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Adaptive Card",
  description: "A minimal starting point for adaptive card experiments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
