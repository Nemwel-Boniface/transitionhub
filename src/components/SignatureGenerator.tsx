"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { EdenCareLogo, GinjaAiLogo } from "@/components/Logo";

function slug(part: string): string {
  return part.replace(/[^a-zA-Z-]/g, "").toLowerCase();
}

function deriveGinjaEmail(fullName: string): string {
  const [first] = fullName.trim().split(/\s+/);
  const f = slug(first ?? "");
  return f ? `${f}@ginja.ai` : "[firstname]@ginja.ai";
}

function deriveEdenEmail(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return "[firstinitial.surname]@edencaremedical.com";
  const first = slug(parts[0]);
  const surname = slug(parts[parts.length - 1]);
  if (!first || !surname) return "[firstinitial.surname]@edencaremedical.com";
  return `${first[0]}.${surname}@edencaremedical.com`;
}

function buildSignature(opts: {
  brandLine: string;
  website: string;
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
}): string {
  const name = opts.fullName.trim() || "[Full Name]";
  const title = opts.jobTitle.trim() || "[Job Title]";
  const phone = opts.phone.trim() || "[Phone Number]";
  return `${name}\n${title}\n${opts.brandLine}\n${opts.email} | ${phone}\n${opts.website}`;
}

function SignatureCard({
  brand,
  brandLine,
  website,
  email,
  fullName,
  jobTitle,
  phone,
  accent,
  logo,
}: {
  brand: string;
  brandLine: string;
  website: string;
  email: string;
  fullName: string;
  jobTitle: string;
  phone: string;
  accent: "orange" | "teal";
  logo: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const signature = useMemo(
    () => buildSignature({ brandLine, website, fullName, jobTitle, phone, email }),
    [brandLine, website, fullName, jobTitle, phone, email]
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(signature);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) - nothing else to do.
    }
  }

  const borderClass = accent === "orange" ? "border-orange/30" : "border-teal/30";
  const brandTextClass = accent === "orange" ? "text-orange" : "text-teal";
  const buttonClass =
    accent === "orange"
      ? "bg-orange text-white hover:opacity-90"
      : "bg-teal text-white hover:bg-teal-dark";

  return (
    <div className={`card p-6 ${borderClass}`}>
      <h2 className="font-semibold text-charcoal">{brand} email signature</h2>
      <div className="mt-4 bg-cream-alt rounded-lg p-4 text-sm whitespace-pre-line">
        <p className="font-medium text-charcoal">{fullName.trim() || "[Full Name]"}</p>
        <p className="text-graytxt">{jobTitle.trim() || "[Job Title]"}</p>
        <p className={`font-medium ${brandTextClass}`}>{brandLine}</p>
        <p className="text-graylight text-xs mt-1">
          {email} | {phone.trim() || "[Phone Number]"}
        </p>
        <p className="text-graylight text-xs">{website}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        {logo}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors focus-ring ${buttonClass}`}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied!" : "Copy signature"}
        </button>
      </div>
    </div>
  );
}

export function SignatureGenerator() {
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");

  const ginjaEmail = useMemo(
    () => (fullName.trim() ? deriveGinjaEmail(fullName) : "[firstname]@ginja.ai"),
    [fullName]
  );
  const edenEmail = useMemo(
    () => (fullName.trim() ? deriveEdenEmail(fullName) : "[firstinitial.surname]@edencaremedical.com"),
    [fullName]
  );

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm bg-white"
        />
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job Title"
          className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm bg-white"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm bg-white"
        />
      </div>

      <div className="mt-5 grid sm:grid-cols-2 gap-5">
        <SignatureCard
          brand="Ginja.ai"
          brandLine="Ginja.ai - Technology partner to Eden Care"
          website="ginja.ai"
          email={ginjaEmail}
          fullName={fullName}
          jobTitle={jobTitle}
          phone={phone}
          accent="orange"
          logo={<GinjaAiLogo className="h-6 w-auto" />}
        />
        <SignatureCard
          brand="Eden Care"
          brandLine="Eden Care"
          website="edencaremedical.com"
          email={edenEmail}
          fullName={fullName}
          jobTitle={jobTitle}
          phone={phone}
          accent="teal"
          logo={<EdenCareLogo className="h-7 w-auto" />}
        />
      </div>
    </div>
  );
}
