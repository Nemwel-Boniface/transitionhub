export type FaqCategory =
  | "Strategy"
  | "Employment & Benefits"
  | "Tools & Systems"
  | "Branding & Communication"
  | "Roles & Escalation";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory | string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamLead {
  id: string;
  team: string;
  leadNames: string[];
  leadEmail?: string;
  leadSlack?: string;
  members: string[];
  notes?: string;
  /** Company-wide leadership (e.g. ExCo) - sits above all departments, not tied to one team. */
  isCompanyWide?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type QuestionStatus = "open" | "resolved";

export interface Question {
  id: string;
  question: string;
  name?: string;
  email?: string;
  status: QuestionStatus;
  answer?: string;
  createdAt: string;
  resolvedAt?: string;
}

export type RelationshipStatus =
  | "Not started"
  | "In progress"
  | "Informed"
  | "Complete";

export interface Relationship {
  id: string;
  clientName: string;
  relationshipOwner: string;
  currentBrand: "Eden Care" | "Ginja.ai" | "Both";
  futureBrand: "Eden Care" | "Ginja.ai" | "Both";
  transitionMethod: string;
  targetDate: string;
  status: RelationshipStatus;
  informed: boolean;
  outstandingActions: string;
  createdAt: string;
  updatedAt: string;
}
