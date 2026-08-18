import { getDb } from "@/lib/redis";
import { listFaqs, createFaq } from "@/lib/db/faqs";
import { listTeamLeads, createTeamLead } from "@/lib/db/leads";

const SEED_FAQS: { question: string; answer: string; category: string; tags: string[] }[] = [
  {
    category: "Strategy",
    question: "Why are we creating two brands?",
    answer:
      "Eden Care and Ginja.ai now have distinct market-facing identities because they serve different purposes. Eden Care is our health insurance business. Ginja.ai is our technology and digital partnerships business.\n\nMaintaining separate brands allows Ginja.ai to remain a trusted, technology-neutral platform that can work with multiple insurers - including Eden Care - while strengthening both businesses as they grow.\n\nThis is a strategic decision approved by ExCo and forms part of our long-term growth strategy. Both businesses are equally important and will continue to grow together.",
    tags: ["strategy", "why", "brands", "excO"],
  },
  {
    category: "Roles & Escalation",
    question: "Who is moving?",
    answer:
      "This is Phase 1 of the transition. For now, only employees whose work is externally client- or partner-facing on behalf of Ginja.ai will begin using the @ginja.ai email address and branding. These include:\n\n- Sales & Commercial\n- Customer Support\n- SPRM\n- Operations\n- Clinical-Context Engineering\n- Leadership & ExCo representing Ginja.ai externally\n\nAll other teams, including Engineering, Operations, Product, Actuarial and other internal functions, continue working exactly as they do today unless otherwise communicated.",
    tags: ["who", "phase 1", "moving", "teams"],
  },
  {
    category: "Branding & Communication",
    question: "What changes?",
    answer:
      "Only our external brand presentation changes. Examples include:\n\n- Email addresses (where applicable)\n- Email signatures\n- Client-facing communications\n- Proposals\n- Contracts\n- Invoices\n- External presentations\n- External representation of Ginja.ai\n\nInternal ways of working remain unchanged.",
    tags: ["what changes", "branding", "external"],
  },
  {
    category: "Employment & Benefits",
    question: "What doesn't change?",
    answer:
      "The following remain exactly the same:\n\n- Your legal employer\n- Your salary\n- Your benefits\n- Your employment terms\n- Your manager\n- Your team\n- Performance management\n- Leave processes\n- Slack\n- Google Workspace\n- Shared Drives\n- Internal meetings\n- Internal collaboration\n\nThis is not an organisational restructure or a systems migration.",
    tags: ["what doesn't change", "employment", "benefits"],
  },
  {
    category: "Employment & Benefits",
    question: "Who is my employer?",
    answer:
      "Eden Care ProActive Limited (Kenya) and Eden Care Group Holdings INC (Group) remains every person's legal entity. Eden Care continues to be responsible for payroll, benefits, employment and consulting contracts, statutory compliance, and HR administration.\n\nEmployees aligned to Ginja.ai simply perform their day-to-day work within the Ginja.ai business unit while remaining employed by Eden Care.",
    tags: ["employer", "legal entity", "payroll"],
  },
  {
    category: "Employment & Benefits",
    question: "Do my benefits change?",
    answer:
      "No. There are no changes to your salary/pay, benefits, leave, medical cover, employment terms, or HR policies.",
    tags: ["benefits", "salary", "leave", "medical cover"],
  },
  {
    category: "Employment & Benefits",
    question: "Does my manager change?",
    answer:
      "No. Reporting lines remain unchanged unless communicated separately through a formal organisational change.",
    tags: ["manager", "reporting lines"],
  },
  {
    category: "Tools & Systems",
    question: "Are Slack and Google Workspace changing?",
    answer:
      "No. Everyone continues using Slack, Google Workspace, Shared Drives, internal documents, and internal collaboration tools exactly as before.",
    tags: ["slack", "google workspace", "tools", "systems"],
  },
  {
    category: "Branding & Communication",
    question: "Which email address do I use?",
    answer:
      "Use the email address appropriate to the audience.\n\nInternal communication: Continue using our existing internal tools and processes.\n\nExternal communication: Employees representing Ginja.ai externally should use their @ginja.ai email address together with the approved Ginja.ai signature.\n\nIf you are unsure which brand should be used, speak to your manager or Transition Lead before sending.",
    tags: ["email", "which brand", "signature"],
  },
  {
    category: "Branding & Communication",
    question: "Is the website changing?",
    answer:
      "Yes - for external audiences. Client-facing materials should direct people to the website that matches the brand being represented. Internal systems and day-to-day work are unaffected.",
    tags: ["website", "external"],
  },
  {
    category: "Roles & Escalation",
    question: "What is my role as a Transition Lead?",
    answer:
      "You are the first point of support for your team. Your role is to:\n\n- Explain the purpose of the transition.\n- Reinforce what is changing - and what is not.\n- Help colleagues use the correct branding.\n- Ensure consistent external communications.\n- Escalate questions you cannot answer.\n- Support a positive and confident transition.",
    tags: ["transition lead", "role", "responsibilities"],
  },
  {
    category: "Roles & Escalation",
    question: "Who do I ask?",
    answer:
      "Team-specific questions → Your Manager or Transition Lead\nBrand, communications or transition questions → Culture & People\nTechnical issues (email access, signatures, systems) → IT / Technology Team\nQuestions requiring clarification or policy decisions → Culture & People, who will coordinate with ExCo where required.\n\nIf you're unsure, please ask before communicating externally. It's always better to check than to use the wrong brand.",
    tags: ["escalation", "contact", "who to ask"],
  },
  {
    category: "Branding & Communication",
    question: "I've worked with a partner for years under my @edencaremedical.com email. How do I introduce the change without causing alarm?",
    answer:
      "Use a standard narrative so every relationship manager tells the same story:\n\n\"You may notice my email address changing to @ginja.ai over the coming weeks. This reflects our decision to separate our technology brand from our health insurance business. You'll still be working with the same team, and there is no impact to our relationship or the services we provide. This simply gives our technology platform its own independent identity.\"\n\nWhere possible, notify strategic accounts before the switch - a personal call, then an email explaining the change, then a follow-up from the new address. The customer should never have to discover the change themselves.",
    tags: ["partner", "customer", "email change", "communication", "playbook"],
  },
  {
    category: "Branding & Communication",
    question: "Should I stop using my @edencaremedical.com email immediately?",
    answer:
      "No - run both addresses during the transition. Forward mail automatically, allow replies from either address for a defined period, and configure an auto-reply on the old address explaining the new one. Customers shouldn't have to remember the new address immediately.",
    tags: ["email", "forwarding", "transition period", "playbook"],
  },
  {
    category: "Branding & Communication",
    question: "What should my email signature look like during the transition?",
    answer:
      "For a transition period, signatures can reinforce continuity through co-branding, for example:\n\n\"Jane Doe - Service Provider Relationship Manager, Ginja.ai - Technology partner to Eden Care\"\n\nor simply \"Ginja.ai - the technology business of Eden Care.\" This helps bridge recognition until the Ginja.ai brand becomes familiar on its own.",
    tags: ["signature", "co-branding", "playbook"],
  },
];

const SEED_LEADS: {
  team: string;
  leadNames: string[];
  leadEmail?: string;
  leadSlack?: string;
  members: string[];
  notes?: string;
  isCompanyWide?: boolean;
}[] = [
  {
    team: "Operations + Commercial",
    leadNames: ["Francis Nyamu", "Newton Muthomi"],
    members: [
      "Anne Gikonyo",
      "Johari Maluki",
      "Jaymin Kotecha",
      "Seraphine Mukei Mbithi",
      "Christopher Wangui",
      "Oscar Osula",
    ],
  },
  {
    team: "Product & Data",
    leadNames: ["Innocent Simiyu"],
    members: ["Steffany Oludo", "Stellah Njeru", "Shayan Kahumu", "Obakeng Ntshodisang", "Betty Waiyego"],
  },
  {
    team: "Core Insurance Engineering",
    leadNames: ["Sagar Shinde"],
    members: [
      "Ekansh Tiwari",
      "Deepak Bodkhe",
      "Gaurav Verma",
      "Harshad Moothedath",
      "Sagar Dhiman",
      "Siddharth Sharma",
      "Pawan Gaur",
    ],
  },
  {
    team: "Clinical Context Engineering",
    leadNames: ["Nemwel Nyandoro", "Nicole Wambui"],
    members: [
      "Dansol Obondo",
      "Eugene Wechuli Simiyu",
      "Kevin Baraza",
      "James Gitere",
      "Larry Kubende",
      "Mark Maina",
      "Mercy Mwikali",
      "Zidane Gimiga",
      "Patience Korir",
      "Naomi Bett",
      "Silas Njoroge",
    ],
  },
  {
    team: "Company-wide Leadership",
    leadNames: ["Kyla-Rei Mulligan", "Moses Mukundi"],
    members: [],
    isCompanyWide: true,
    notes:
      "Company-wide leadership, representing Ginja.ai externally across all teams - not tied to a single department.",
  },
];

export async function seedIfEmpty(): Promise<{ faqsSeeded: number; leadsSeeded: number }> {
  const db = getDb();
  // Atomic "claim the seed job" - concurrent cold starts (common right after
  // a deploy) will all call this around the same time, but only the one
  // that actually wins this setNX proceeds. Everyone else sees false and
  // returns immediately, which is what prevents duplicate seed data.
  const claimed = await db.setNX("th:seeded", new Date().toISOString());
  if (!claimed) return { faqsSeeded: 0, leadsSeeded: 0 };

  const existingFaqs = await listFaqs();
  const existingLeads = await listTeamLeads();

  let faqsSeeded = 0;
  let leadsSeeded = 0;

  if (existingFaqs.length === 0) {
    for (const faq of SEED_FAQS) {
      await createFaq(faq);
      faqsSeeded++;
    }
  }

  if (existingLeads.length === 0) {
    for (const lead of SEED_LEADS) {
      await createTeamLead(lead);
      leadsSeeded++;
    }
  }

  return { faqsSeeded, leadsSeeded };
}
