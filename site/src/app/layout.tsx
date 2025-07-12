import { TRPCProvider } from "@/trpc/client";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const font = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Metabook - AI Trading Journal",
    default: "Metabook - AI Trading Journal",
  },
  description:
    "A simple trade journaling application with AI assistance for analysis and statistics.",
  icons: [
    {
      rel: "icon",
      url: "/logo.png",
      href: "/logo.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <TRPCProvider>
        <html lang="en">
          <body
            className={`${font.className} antialiased flex flex-col min-h-screen relative`}
          >
            {children}
          </body>
        </html>
      </TRPCProvider>
    </SessionProvider>
  );
}
