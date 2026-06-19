import type { Metadata } from "next";
import "@/app/globals.css";
import { ProgressProvider } from "@/context/progress-context";

export const metadata: Metadata = {
  title: "耶输陀罗：莲华因缘",
  description: "基于《Yasodharātherī-apadāna》的剧情式巴利语学习游戏",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
