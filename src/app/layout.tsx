import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "新北高工｜AI 統測自主學習平台",
  description: "動力機械群汽車科本機示範版：教師審題、雙題庫、自主練習、模擬考與學習診斷。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
