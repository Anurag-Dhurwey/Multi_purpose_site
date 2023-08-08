import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "@/redux_toolkit/store";
import { Providers } from "@/redux_toolkit/provider";
const inter = Inter({ subsets: ["latin"] });
import { Navbar } from "@/components";

export const metadata = {
  title: "Multi_Purpose",
  description: "This Multi_Pupose App can help in your daily task",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
