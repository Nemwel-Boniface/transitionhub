// Computed from real dates below, so it must render per-request rather than
// being statically frozen at build time.
export const dynamic = "force-dynamic";

const STEPS = [
  {
    label: "Now",
    title: "Internal alignment",
    desc: "Team-wide briefing on what changes and what doesn't. TransitionHub goes live for self-serve questions.",
    startDate: "2026-08-04",
  },
  {
    label: "Next",
    title: "Transition Lead enablement",
    desc: "Every team's Transition Lead is equipped with the FAQ, brand guide, and escalation paths to support their colleagues first-line.",
    startDate: "2026-08-17",
  },
  {
    label: "Then",
    title: "Phase 1 external rollout",
    desc: "Client- and partner-facing teams (Sales & Commercial, Customer Support & SPRM, Leadership & ExCo) begin using @ginja.ai for external communication.",
    startDate: "2026-08-24",
  },
  {
    label: "Ongoing",
    title: "Relationship-by-relationship transition",
    desc: "Relationship owners work through their accounts using the standard narrative, co-branded signatures, and dual-inbox forwarding - tracked in the Relationship Tracker.",
    startDate: "2026-08-24",
  },
  {
    label: "End of August",
    title: "Review & confidence check",
    desc: "Transition Leads and managers report on customer confusion, recurring questions, and any outstanding gaps, feeding back into the FAQ.",
    startDate: "2026-08-31",
  },
];

/** The last step whose startDate has already passed - i.e. where the company actually is today. */
function getCurrentStepIndex(steps: typeof STEPS, today: Date): number {
  let current = 0;
  for (let i = 0; i < steps.length; i++) {
    if (new Date(steps[i].startDate) <= today) current = i;
  }
  return current;
}

export default function TimelinePage() {
  const currentIndex = getCurrentStepIndex(STEPS, new Date());

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <span className="text-xs font-semibold tracking-wide uppercase text-teal">Timeline</span>
      <h1 className="mt-2 text-3xl font-bold text-charcoal">
        What to expect between now and the end of August.
      </h1>
      <p className="mt-3 text-graytxt">
        This is Phase 1 - a brand consistency effort, not a systems migration. Later phases
        will be communicated separately with their own timeline.
      </p>

      <div className="mt-12 relative pl-8">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-borderc" aria-hidden />
        <div className="space-y-10">
          {STEPS.map((step, i) => {
            const isActive = i === currentIndex;
            return (
              <div key={step.title} className="relative">
                <div className="absolute -left-8 top-0.5 h-6 w-6">
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-full bg-orange opacity-75 motion-safe:animate-ping motion-reduce:hidden"
                      aria-hidden
                    />
                  )}
                  <div
                    className={`relative h-6 w-6 rounded-full text-white text-[11px] font-semibold flex items-center justify-center ring-4 ${
                      isActive ? "bg-orange ring-orange/40" : "bg-teal ring-cream"
                    }`}
                  >
                    {i + 1}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wide text-orange">
                    {step.label}
                  </span>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange motion-safe:animate-pulse motion-reduce:hidden" />
                      You are here
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-semibold text-charcoal">{step.title}</h3>
                <p className="mt-1.5 text-sm text-graytxt max-w-lg">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
