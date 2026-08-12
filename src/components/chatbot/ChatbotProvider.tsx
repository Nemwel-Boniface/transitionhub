"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Chatbot } from "./Chatbot";

export function ChatbotProvider() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <Chatbot onClose={() => setOpen(false)} />}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open TransitionHub assistant"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-teal text-white pl-4 pr-5 py-3 shadow-xl hover:bg-teal-dark transition-colors focus-ring"
        >
          <span className="relative">
            <MessageCircle size={20} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-orange ring-2 ring-teal" />
          </span>
          <span className="text-sm font-medium hidden sm:inline">Ask TransitionHub</span>
        </button>
      )}
    </>
  );
}
