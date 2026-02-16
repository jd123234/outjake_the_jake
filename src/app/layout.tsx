import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};

export const metadata: Metadata = {
  metadataBase: new URL('https://outjake-the-jake.vercel.app'), // Update this to your actual Vercel URL
  title: "Out Snake the Jake - Party Game",
  description:
    "A fun party game where one player is the Snake who creates a fake answer to trick the group!",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Out Snake the Jake"
  },
  openGraph: {
    title: "Out Snake the Jake - Party Game",
    description: "A fun party game where one player is the Snake who creates a fake answer to trick the group!",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Out Snake the Jake - Party Game Logo"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Out Snake the Jake - Party Game",
    description: "A fun party game where one player is the Snake who creates a fake answer to trick the group!",
    images: ["/logo.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Out Snake the Jake" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Apple Touch Icons for home screen */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        
        {/* Standard favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className="antialiased">
        <div className="mobile-container">
          {children}
        </div>
      </body>
    </html>
  );
}
