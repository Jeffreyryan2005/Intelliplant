import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "IntelliPlant — AI-Powered Industrial Knowledge Intelligence",
  description:
    "Transform plant operations with AI-driven document intelligence, knowledge graphs, and predictive maintenance for the petrochemical industry.",
  keywords: ["industrial AI", "knowledge graph", "plant maintenance", "compliance", "document intelligence"],
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full flex bg-bg-primary font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
