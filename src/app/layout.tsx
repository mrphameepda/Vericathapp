import type { Metadata, Viewport } from "next";
import { Playfair_Display, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0b132b",
};

export const metadata: Metadata = {
  title: "Vericath - Cổng Tra Cứu & Học Thuật Công Giáo",
  description: "Cổng thông tin, tra cứu Kinh Thánh, Giáo Lý, Giáo Luật & Phụng Vụ Công Giáo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${sourceSerif.variable} ${playfair.variable} h-full antialiased font-sans`}
    >
      <head>
        <link rel="preconnect" href="https://vericath.org" />
        <link rel="dns-prefetch" href="https://vericath.org" />
      </head>
      <body className="min-h-full flex flex-col safe-area-top safe-area-bottom" suppressHydrationWarning>
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
