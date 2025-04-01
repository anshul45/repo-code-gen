import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

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
    <html lang="en" className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
      <body className="min-h-screen flex">
        <Providers>
          {/* Main content */}
          <div className="flex-1 flex flex-col">
          
            {children}
          </div>
        </Providers>
      </body>
    </html >
  );
}
