import type { Metadata } from "next";
import { Libre_Baskerville, DM_Sans } from "next/font/google";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "AquilaStudios | Premium Digital Agency",
  description: "Modern digital experiences and web development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${libreBaskerville.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </body>
    </html>
  );
}