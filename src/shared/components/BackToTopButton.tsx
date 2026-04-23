"use client";
import { ArrowUp } from "lucide-react";
export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <button
      onClick={scrollToTop}
      className="cursor-pointer rounded-lg p-3 transition-all"
      aria-label="Scroll to top"
    >
      <ArrowUp size={32} />
    </button>
  );
}
