import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Outfox the Fox - Party Game",
  description:
    "A fun party game where one player creates a fake answer to trick the group!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="iphone-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
