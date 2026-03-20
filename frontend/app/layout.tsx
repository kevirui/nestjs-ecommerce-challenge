import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Commerce Dashboard | Real-time Monitoring",
  description:
    "Dashboard de monitoreo en tiempo real para el sistema de e-commerce. Consume la API REST del backend y refleja eventos de dominio mediante SSE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
