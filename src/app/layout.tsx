import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatbotProvider } from "@/components/chatbot/ChatbotProvider";

export const metadata: Metadata = {
  title: "TransitionHub - Eden Care & Ginja.ai",
  description:
    "Everything you need to know about the Eden Care and Ginja.ai brand transition - FAQs, transition leads, timeline, and a live chatbot to answer your questions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatbotProvider />
      </body>
    </html>
  );
}
