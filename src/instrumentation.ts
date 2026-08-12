export async function register() {
  // Only run in the Node.js server runtime (not edge, not the browser).
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { seedIfEmpty } = await import("@/lib/db/seed");
    try {
      const result = await seedIfEmpty();
      if (result.faqsSeeded || result.leadsSeeded) {
        console.log(
          `[TransitionHub] Seeded ${result.faqsSeeded} FAQs and ${result.leadsSeeded} team leads.`
        );
      }
    } catch (err) {
      console.error("[TransitionHub] Seeding failed:", err);
    }
  }
}
