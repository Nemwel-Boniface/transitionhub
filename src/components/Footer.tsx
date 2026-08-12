import Link from "next/link";
import { DualBrandLockup } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-borderc bg-white/60 mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <DualBrandLockup />
          <p className="mt-3 text-sm text-graytxt max-w-xs">
            One team, two brands. Eden Care is our health insurance business.
            Ginja.ai is our technology and digital partnerships business.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-charcoal mb-3">Get help</h4>
          <ul className="space-y-2 text-sm text-graytxt">
            <li>
              <Link href="/transition-leads" className="hover:text-teal focus-ring rounded">
                Find your Transition Lead
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-teal focus-ring rounded">
                Browse the FAQ
              </Link>
            </li>
            <li>Culture &amp; People - reach out via Slack or email</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-charcoal mb-3">TransitionHub</h4>
          <ul className="space-y-2 text-sm text-graytxt">
            <li>
              <Link href="/timeline" className="hover:text-teal focus-ring rounded">
                Timeline
              </Link>
            </li>
            <li>
              <Link href="/brand-guide" className="hover:text-teal focus-ring rounded">
                Brand guide
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-teal focus-ring rounded">
                Admin panel
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-graylight pb-6">
        You should leave this feeling informed, supported and excited - not confused.
      </div>
    </footer>
  );
}
