import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Johnnie Yu - Developer & Designer",
  description: "Versatile cross-functional developer, dedicated to crafting & refining digital narratives alongside various innovative tools.",
  keywords: ["developer", "designer", "portfolio", "nextjs", "react"],
  authors: [{ name: "Johnnie Yu" }],
  openGraph: {
    title: "Johnnie Yu - Developer & Designer",
    description: "Versatile cross-functional developer, dedicated to crafting & refining digital narratives alongside various innovative tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
