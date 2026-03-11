import type { Metadata } from "next";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata: Metadata = {
  title: "Tripperoma AI",
  description: "AI-powered travel planner",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0a0a0f" }}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}