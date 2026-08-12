import Link from "next/link";
import { ArrowRight, Search, Users, Calendar, MessageCircle } from "lucide-react";
import { EdenCareLogo, GinjaAiLogo } from "@/components/Logo";
import { BrandSplitRule } from "@/components/BrandSplit";

const QUICK_LINKS = [
  { href: "/what-changes", title: "What Changes", desc: "See exactly what's different - and what isn't.", icon: ArrowRight },
  { href: "/timeline", title: "Timeline", desc: "What to expect between now and end of August.", icon: Calendar },
  { href: "/faq", title: "FAQ", desc: "Search or filter every question we've collected.", icon: Search },
  { href: "/transition-leads", title: "Find Your Lead", desc: "Look up your team's Transition Lead by name.", icon: Users },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-14">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-teal bg-teal/10 px-3 py-1 rounded-full">
            Team Briefing · Prepared by Culture &amp; People
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold text-charcoal">
            One Team. <span className="text-teal">Two Brands.</span>
          </h1>
          <p className="mt-5 text-lg text-graytxt leading-relaxed">
            Understanding the Eden Care &amp; Ginja.ai brand transition. Same tools inside.
            New brand outside. This is your home for what&apos;s changing, what isn&apos;t, and who
            to ask when you&apos;re not sure.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 bg-teal text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-teal-dark transition-colors focus-ring"
            >
              Browse the FAQ <ArrowRight size={16} />
            </Link>
            <Link
              href="/transition-leads"
              className="inline-flex items-center gap-2 border border-borderc px-5 py-3 rounded-full text-sm font-medium hover:border-teal hover:text-teal transition-colors focus-ring"
            >
              Find your Transition Lead
            </Link>
          </div>
          <p className="mt-4 text-sm text-graylight flex items-center gap-1.5">
            <MessageCircle size={14} className="text-orange" /> Or tap the assistant in the corner - it&apos;s built to answer this stuff instantly.
          </p>
        </div>
      </section>

      <BrandSplitRule />

      {/* Two brands, one company */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-graytxt mb-6">
          One company, two equally important businesses
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="card p-7">
            <EdenCareLogo className="h-8 w-auto mb-4" />
            <h3 className="font-semibold text-lg text-charcoal">Our health insurance business</h3>
            <p className="mt-2 text-sm text-graytxt leading-relaxed">
              Eden Care remains every employee&apos;s legal employer, responsible for payroll,
              benefits and employment compliance - regardless of which brand your day-to-day
              work sits under.
            </p>
          </div>
          <div className="card p-7">
            <GinjaAiLogo className="h-7 w-auto mb-4" />
            <h3 className="font-semibold text-lg text-charcoal">Our technology &amp; digital partnerships business</h3>
            <p className="mt-2 text-sm text-graytxt leading-relaxed">
              Ginja.ai is our technology-neutral SaaS platform, built to work with multiple
              insurers - including Eden Care - as its own independently trusted brand.
            </p>
          </div>
        </div>

        <div className="mt-6 card p-6 flex items-center gap-4 border-teal/20 bg-teal/5">
          <div className="h-2.5 w-2.5 rounded-full bg-orange shrink-0" />
          <p className="text-charcoal font-medium">
            The rule, in one line: <span className="text-teal">same tools inside, new brand outside.</span>
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-4 pb-20">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-graytxt mb-6">
          Jump to what you need
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_LINKS.map(({ href, title, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="card p-5 hover:border-teal hover:shadow-md transition-all group focus-ring"
            >
              <Icon size={20} className="text-teal" />
              <h3 className="mt-3 font-semibold text-charcoal group-hover:text-teal transition-colors">
                {title}
              </h3>
              <p className="mt-1 text-sm text-graytxt">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
