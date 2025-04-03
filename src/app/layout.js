import "./globals.css";
import { Inter } from "next/font/google";
import LayoutClient from './LayoutClient';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Supply Chain Management",
  description: "Product Tracking Dapp",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
};

export default RootLayout;

