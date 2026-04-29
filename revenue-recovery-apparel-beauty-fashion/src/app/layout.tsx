import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Altynx Revenue Recovery System",
  description:
    "Revenue recovery workspace for fashion, apparel, beauty, skincare, and cosmetics brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
