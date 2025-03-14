import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Header/>
        <div className="flex">
          <div className="flex-[0.025]">
            <Sidebar />
          </div>
          <div className="flex-[0.975]">{children}</div>
        </div>
      </body>
    </html>
  );
}
