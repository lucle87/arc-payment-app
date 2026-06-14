import "./globals.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {

  title:
    "ARC Transaction Explorer",

  description:
    "Transaction Memo Explorer on ARC",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="en">

      <body className="bg-black text-white">

        <Navbar />

        {children}

        <Footer />

      </body>

    </html>

  );

}