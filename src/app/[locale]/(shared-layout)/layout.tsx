import BackToTopButton from "@/shared/components/BackToTopButton";
import Footer from "@/shared/components/Footer";
import Header from "@/shared/components/header/Header";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative">
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <section className="fixed right-4 bottom-4 z-50 md:right-6 md:bottom-6">
        <BackToTopButton />
      </section>
    </main>
  );
}
