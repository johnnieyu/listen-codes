import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Listen.co(des)",
  description: "Listen.codes is a project led by Johnnie Yu, tech-ifying the combined knowledge of Listen into a series of tech products, sometimes useful, mostly experimental.",
  authors: [{ name: "Johnnie Yu" }],
  openGraph: {
    title: "Listen.co(des)",
    description: "Listen.codes is a project led by Johnnie Yu, tech-ifying the combined knowledge of Listen into a series of tech products, sometimes useful, mostly experimental.",
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
      <head>
        <Script
          src="https://umami.listen.codes/script.js"
          data-website-id="737cc6af-7158-407a-a868-b7b07d8dd0e2"
          strategy="afterInteractive"
          defer
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
