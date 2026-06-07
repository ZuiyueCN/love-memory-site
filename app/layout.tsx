import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "我们的恋爱纪念册",
  description: "记录照片、时间线和生活瞬间的恋爱纪念网站"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
