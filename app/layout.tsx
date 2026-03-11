import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata: Metadata = {
  title: "EuroTrip AI",
  description: "AI-powered European travel planner",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}