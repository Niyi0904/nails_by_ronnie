
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/redux/Provider"
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: "Nails by ronnie",
  description: "Nails by ronnie is a application that links customers with the best nailtechnician in lagos, it is easy to use and user friendly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}


