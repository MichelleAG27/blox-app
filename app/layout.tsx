import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import QueryProvider from "./QueryProvider";

const font = Sora ({
  weight:['100', '200', '300', '400', '500', '600', '700', '800'],
  subsets:['latin']

})

export const metadata: Metadata = {
  title: "BloX App",
  description: "Dashboard for Manage User and Blog Posts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}