import { BrandSplitRule } from "@/components/BrandSplit";
import { SignatureGenerator } from "@/components/SignatureGenerator";

export default function BrandGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <span className="text-xs font-semibold tracking-wide uppercase text-teal">Brand in Practice</span>
      <h1 className="mt-2 text-3xl font-bold text-charcoal">
        The customer should experience continuity, not change.
      </h1>
      <p className="mt-3 text-graytxt leading-relaxed">
        &ldquo;The person you trust hasn&apos;t changed. The service you receive hasn&apos;t changed.
        Only the brand under which part of our work is presented has evolved.&rdquo;
      </p>

      <BrandSplitRule className="my-10" />

      <section className="card p-6">
        <h2 className="font-semibold text-lg text-charcoal">The standard narrative</h2>
        <p className="mt-2 text-sm text-graytxt">Use this consistently with every external contact:</p>
        <blockquote className="mt-3 border-l-4 border-teal pl-4 text-sm italic text-charcoal">
          &ldquo;You may notice my email address changing to @ginja.ai over the coming weeks. This
          reflects our decision to separate our technology brand from our health insurance
          business. You&apos;ll still be working with the same team, and there is no impact to
          our relationship or the services we provide. This simply gives our technology
          platform its own independent identity.&rdquo;
        </blockquote>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold text-lg text-charcoal">Build your signature</h2>
        <p className="mt-2 text-sm text-graytxt">
          Approved by ExCo, 3 August 2026. Fill in your details below - both previews update as
          you type, and each has its own copy button so you never have to retype the format
          by hand.
        </p>
        <div className="mt-4">
          <SignatureGenerator />
        </div>
      </section>

      <section className="mt-6 card p-6">
        <h2 className="font-semibold text-charcoal">Run both addresses during the transition</h2>
        <ul className="mt-3 space-y-2 text-sm text-graytxt list-disc pl-5">
          <li>Forward mail automatically from the old address.</li>
          <li>Allow replies from either address for a defined period.</li>
          <li>Configure an auto-reply on the old address explaining the new one.</li>
          <li>Ensure no messages are lost in the switch.</li>
        </ul>
        <p className="mt-3 text-xs text-graylight">
          Customers shouldn&apos;t have to remember the new address immediately.
        </p>
      </section>

      <section className="mt-6 card p-6">
        <h2 className="font-semibold text-charcoal">Before you hit send - three checks</h2>
        <ol className="mt-3 space-y-2 text-sm text-graytxt list-decimal pl-5">
          <li>Who is this audience - internal or external?</li>
          <li>If external, are they engaging with Eden Care, Ginja.ai, or both?</li>
          <li>Does my signature and messaging match that brand?</li>
        </ol>
        <p className="mt-3 text-xs text-graylight">
          If you&apos;re unsure, ask your manager or Transition Lead before communicating externally.
        </p>
      </section>

      <section className="mt-6 card p-6">
        <h2 className="font-semibold text-charcoal">For engineers &amp; technical contacts</h2>
        <p className="mt-2 text-sm text-graytxt">
          Integration teams, technical contacts, and implementation partners care less about
          branding and more about continuity of service. Keep the emphasis on:
        </p>
        <blockquote className="mt-3 border-l-4 border-orange pl-4 text-sm italic text-charcoal">
          &ldquo;Our technical contacts remain the same. Our delivery commitments remain the same.
          This is simply a brand identity update.&rdquo;
        </blockquote>
      </section>
    </div>
  );
}
