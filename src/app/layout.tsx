import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScnrMx — On-Chain Intelligence",
  description: "AI-powered blockchain analytics platform. Ask the chain anything.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#09090b] text-[#f0f0f2] antialiased">
        {children}
      </body>
    </html>
  );
}
