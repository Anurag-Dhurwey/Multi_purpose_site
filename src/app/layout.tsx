import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/redux_toolkit/provider";
const inter = Inter({ subsets: ["latin"] });
import { Navbar } from "@/components";

export const metadata = {
  title: "Project_M",
  description: "A social media project created by anurag dhurwey",
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
