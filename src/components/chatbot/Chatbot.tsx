"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { Faq, TeamLead } from "@/lib/types";
import { searchFaqs, groupByCategory } from "@/lib/search";
import { DEPARTMENTS, findInDirectory } from "@/lib/directory";
import { Highlight } from "@/components/Highlight";
import { ChatMessage, QuickReply, Stage } from "./types";

let idCounter = 0;
const nextId = () => `m${++idCounter}-${Date.now()}`;

const GREETING =
  "Hi, I'm the TransitionHub assistant. I can help you understand the Eden Care & Ginja.ai brand transition - ask me anything, or pick an option below.";

const ROOT_OPTIONS: QuickReply[] = [
  { label: "🔍 Search a question", action: "search" },
  { label: "📂 Browse by topic", action: "browse" },
  { label: "🧭 Find my Transition Lead", action: "lookup" },
  { label: "✍️ Ask something new", action: "ask" },
  { label: "☎️ Talk to Culture & People", action: "contact" },
];

export function Chatbot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stage, setStage] = useState<Stage>("menu");
  const [typing, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [leads, setLeads] = useState<TeamLead[]>([]);
  const [draftQuestion, setDraftQuestion] = useState("");
  const [draftName, setDraftName] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Load FAQ + lead data once when the widget first mounts. No polling -
  // this is the only network fetch outside of explicit user actions
  // (submitting a question), per the "no polling" data-cost constraint.
  useEffect(() => {
    Promise.all([
      fetch("/api/faqs").then((r) => r.json()),
      fetch("/api/leads").then((r) => r.json()),
    ])
      .then(([faqData, leadData]) => {
        setFaqs(faqData.faqs ?? []);
        setLeads(leadData.leads ?? []);
      })
      .catch(() => {
        setFaqs([]);
        setLeads([]);
      });
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    pushBot(GREETING, ROOT_OPTIONS);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function pushUser(text: string) {
    setMessages((m) => [...m, { id: nextId(), from: "user", text }]);
  }

  function pushBot(text: ReactNode, quickReplies?: QuickReply[], isAnswer = false, delay = 500) {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: nextId(), from: "bot", text, quickReplies, isAnswer }]);
    }, delay);
  }

  function goToMenu(intro = "Anything else I can help with?") {
    setStage("menu");
    pushBot(intro, ROOT_OPTIONS);
  }

  function handleQuickReply(qr: QuickReply) {
    pushUser(qr.label);

    switch (qr.action) {
      case "search":
        setStage("search_input");
        pushBot("Type a keyword or question below - for example \"email signature\" or \"who is my employer\".");
        break;

      case "browse": {
        setStage("browse_categories");
        const grouped = groupByCategory(faqs);
        const categories = Object.keys(grouped);
        if (categories.length === 0) {
          pushBot("There aren't any FAQ topics loaded yet - try again in a moment, or ask me directly.");
          goToMenu();
          break;
        }
        pushBot(
          "Here are the topics I can help with:",
          categories.map((c) => ({ label: c, action: "category", payload: c }))
        );
        break;
      }

      case "category": {
        const grouped = groupByCategory(faqs);
        const items = grouped[qr.payload ?? ""] ?? [];
        pushBot(
          `${items.length} question${items.length === 1 ? "" : "s"} in "${qr.payload}":`,
          items.map((f) => ({ label: f.question, action: "faq", payload: f.id }))
        );
        break;
      }

      case "faq": {
        const faq = faqs.find((f) => f.id === qr.payload);
        if (faq) {
          pushBot(faq.answer, undefined, true);
          window.setTimeout(() => {
            pushBot("Did that answer your question?", [
              { label: "👍 Yes, thanks", action: "helpful_yes" },
              { label: "👎 Not quite", action: "helpful_no" },
            ]);
          }, 700);
        }
        break;
      }

      case "helpful_yes":
        goToMenu("Glad that helped! Anything else?");
        break;

      case "helpful_no":
        pushBot("Sorry about that - let's log your question so Culture & People can follow up directly.");
        setStage("ask_input");
        break;

      case "lookup":
        setStage("menu");
        pushBot("How would you like to find your Transition Lead?", [
          { label: "🔎 Search by name", action: "lookup_by_name" },
          { label: "📂 Browse by department", action: "lookup_by_department" },
        ]);
        break;

      case "lookup_by_name":
        setStage("lookup_input");
        pushBot("Type your name (first name is fine) and I'll tell you your department and Transition Lead.");
        break;

      case "lookup_by_department":
        setStage("menu");
        pushBot(
          "Pick a department to see its Transition Lead(s) and full roster:",
          DEPARTMENTS.map((d) => ({ label: d, action: "department", payload: d }))
        );
        break;

      case "department": {
        const dept = qr.payload ?? "";
        const lead = leads.find((l) => l.team === dept);
        if (!lead) {
          pushBot(`I don't have "${dept}" in the directory yet.`);
          goToMenu();
          break;
        }
        const leadLine = lead.isCompanyWide
          ? `Company-wide leadership: ${lead.leadNames.join(" & ")}`
          : `Transition Lead${lead.leadNames.length > 1 ? "s" : ""}: ${lead.leadNames.join(", ")}`;
        pushBot(
          `${dept}\n\n${leadLine}${
            lead.members.length > 0 ? `\n\nTeam: ${lead.members.join(", ")}` : ""
          }`,
          [
            ...lead.members.map((m) => ({ label: m, action: "lookup_person", payload: m })),
            { label: "⬅️ Back to menu", action: "back_to_menu" },
          ],
          true
        );
        setStage("menu");
        break;
      }

      case "lookup_person":
        runLookup(qr.payload ?? "");
        break;

      case "ask":
        setStage("ask_input");
        pushBot("Go ahead and type your question - I'll make sure it reaches Culture & People.");
        break;

      case "contact":
        pushBot(
          "Brand, communications or transition questions → Culture & People.\nTeam-specific questions → your Manager or Transition Lead.\nTechnical issues (email access, signatures, systems) → IT / Technology Team.\n\nIf you're ever unsure which brand to use externally, it's always better to check first."
        );
        goToMenu();
        break;

      case "back_to_menu":
        goToMenu();
        break;

      case "submit_anyway":
        finalizeQuestion();
        break;

      case "add_name":
        setStage("ask_name");
        pushBot("What's your name? (optional - you can also type \"skip\")");
        break;

      default:
        goToMenu();
    }
  }

  function runSearch(query: string) {
    const results = searchFaqs(faqs, query, 4);
    if (results.length === 0) {
      pushBot(
        `I couldn't find a matching answer for "${query}". Want to log it so Culture & People can respond directly?`,
        [
          { label: "✍️ Log this question", action: "submit_anyway" },
          { label: "⬅️ Back to menu", action: "back_to_menu" },
        ]
      );
      setDraftQuestion(query);
      return;
    }
    pushBot(
      `Here's what I found for "${query}":`,
      results.map((r) => ({ label: r.faq.question, action: "faq", payload: r.faq.id }))
    );
    setStage("menu");
  }

  function runLookup(name: string) {
    const match = findInDirectory(leads, name);

    if (!match) {
      pushBot(
        <>
          I couldn&apos;t find &quot;
          <mark className="bg-orange/25 text-charcoal rounded px-0.5">{name}</mark>
          &quot; in the directory yet. This list is still being filled in - try your full name,
          or check with your manager. Want me to log this as a gap for HR to fix?
        </>,
        [
          { label: "✍️ Log this", action: "submit_anyway" },
          { label: "⬅️ Back to menu", action: "back_to_menu" },
        ]
      );
      setDraftQuestion(`Directory lookup failed for name: "${name}". Please add them to a team.`);
      return;
    }

    if (match.kind === "companyWide") {
      pushBot(
        <>
          You&apos;re part of company-wide leadership, representing Ginja.ai externally across
          all teams - not tied to a single department.
          {"\n\n"}
          {match.entry.leadNames.map((n, idx) => (
            <span key={n}>
              {idx > 0 && " & "}
              {n === match.matchedName ? <Highlight text={n} query={name} /> : n}
            </span>
          ))}
          {" - escalate brand or communications questions here."}
        </>,
        undefined,
        true
      );
    } else if (match.kind === "lead") {
      const coLeadLine =
        match.coLeads.length > 0 ? `\nCo-lead${match.coLeads.length > 1 ? "s" : ""}: ${match.coLeads.join(", ")}` : "";
      pushBot(
        <>
          🎉 Congratulations - <Highlight text={match.matchedName} query={name} /> is the Transition
          Lead for {match.lead.team}!{coLeadLine}
          {match.lead.members.length > 0 ? `\n\nYour team: ${match.lead.members.join(", ")}` : ""}
        </>,
        undefined,
        true
      );
    } else {
      pushBot(
        <>
          <Highlight text={match.matchedName} query={name} /> is on the {match.lead.team} team.
          {"\n\n"}Transition Lead{match.lead.leadNames.length > 1 ? "s" : ""}:{" "}
          {match.lead.leadNames.join(", ")}
          {match.lead.leadEmail ? `\nEmail: ${match.lead.leadEmail}` : ""}
          {match.lead.leadSlack ? `\nSlack: ${match.lead.leadSlack}` : ""}
          {match.lead.notes ? `\n\nNote: ${match.lead.notes}` : ""}
        </>,
        undefined,
        true
      );
    }
    window.setTimeout(() => goToMenu(), 700);
    setStage("menu");
  }

  function finalizeQuestion(name?: string, email?: string) {
    const q = draftQuestion.trim();
    if (!q) {
      goToMenu();
      return;
    }
    fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, name, email }),
    })
      .then((r) => r.json())
      .then(() => {
        pushBot(
          "Logged! Your question has gone to Culture & People / HR - they'll respond directly, and the answer may also be added to the FAQ.",
          undefined
        );
        window.setTimeout(() => goToMenu(), 800);
      })
      .catch(() => {
        pushBot("Something went wrong logging that - please try again in a moment.");
        goToMenu();
      });
    setDraftQuestion("");
    setDraftName("");
    setStage("menu");
  }

  function handleTextSubmit() {
    const value = inputValue.trim();
    if (!value) return;
    pushUser(value);
    setInputValue("");

    if (stage === "search_input" || stage === "menu") {
      runSearch(value);
    } else if (stage === "lookup_input") {
      runLookup(value);
    } else if (stage === "ask_input") {
      setDraftQuestion(value);
      pushBot("Want to leave your name so someone can follow up with you directly?", [
        { label: "Yes, add my name", action: "add_name" },
        { label: "No, submit anonymously", action: "submit_anyway" },
      ]);
    } else if (stage === "ask_name") {
      const name = value.toLowerCase() === "skip" ? undefined : value;
      setDraftName(name ?? "");
      if (name) {
        pushBot("And an email, so they can reply? (optional - type \"skip\" to leave it out)");
        setStage("ask_email");
      } else {
        finalizeQuestion();
      }
    } else if (stage === "ask_email") {
      const email = value.toLowerCase() === "skip" ? undefined : value;
      finalizeQuestion(draftName || undefined, email);
    }
  }

  const showTextInput = ["search_input", "lookup_input", "ask_input", "ask_name", "ask_email", "menu"].includes(
    stage
  );

  const placeholder =
    stage === "lookup_input"
      ? "Type your name…"
      : stage === "ask_input"
      ? "Type your question…"
      : stage === "ask_name"
      ? "Your name (or 'skip')"
      : stage === "ask_email"
      ? "Your email (or 'skip')"
      : "Ask a question, e.g. \"email signature\"…";

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))] h-[min(34rem,calc(100vh-6rem))] flex flex-col rounded-2xl border border-borderc bg-white shadow-2xl overflow-hidden"
      role="dialog"
      aria-label="TransitionHub assistant"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-teal text-white">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles size={20} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-orange ring-2 ring-teal" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">TransitionHub Assistant</p>
            <p className="text-[11px] text-white/80 mt-0.5">Online · no wait time</p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close chat" className="p-1 rounded-md hover:bg-white/10 focus-ring">
          <X size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-cream-alt">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-line text-sm px-3 py-2 rounded-2xl ${
                m.from === "user"
                  ? "bg-teal text-white rounded-br-sm"
                  : m.isAnswer
                  ? "bg-white border border-teal/30 text-charcoal rounded-bl-sm shadow-sm"
                  : "bg-white text-charcoal rounded-bl-sm border border-borderc"
              }`}
            >
              {m.text}
            </div>
            {m.quickReplies && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                {m.quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(qr)}
                    className="text-xs px-3 py-1.5 rounded-full border border-teal text-teal hover:bg-teal hover:text-white transition-colors focus-ring"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-1 bg-white border border-borderc rounded-2xl px-3 py-2 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-graylight animate-bounce [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-graylight animate-bounce [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-graylight animate-bounce" />
          </div>
        )}
      </div>

      {showTextInput && (
        <div className="border-t border-borderc p-2.5 flex items-center gap-2 bg-white">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder={placeholder}
            className="flex-1 text-sm px-3 py-2 rounded-full border border-borderc focus-ring outline-none"
          />
          <button
            onClick={handleTextSubmit}
            aria-label="Send"
            className="p-2 rounded-full bg-orange text-white hover:opacity-90 transition-opacity focus-ring"
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
