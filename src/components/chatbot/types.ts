import { ReactNode } from "react";

export interface QuickReply {
  label: string;
  action: string;
  payload?: string;
}

export interface ChatMessage {
  id: string;
  from: "bot" | "user";
  text: ReactNode;
  quickReplies?: QuickReply[];
  /** When true, renders as a bordered "answer card" rather than a plain bubble. */
  isAnswer?: boolean;
}

export type Stage =
  | "menu"
  | "search_input"
  | "browse_categories"
  | "lookup_input"
  | "ask_input"
  | "ask_name"
  | "ask_email"
  | "idle";
