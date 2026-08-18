"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { EdenCareLogo, GinjaAiLogo } from "@/components/Logo";

const SITE_URL = "https://transitionhub.vercel.app";
const TAGLINE_PREFIX = "Eden Care Medical / Ginja.AI - ";
const TAGLINE = "Powering technology for Eden Care and beyond";
const EDEN_URL = "https://www.edencaremedical.com/";
const GINJA_URL = "https://www.ginja.ai/";

const CLOSING_PRESETS = ["Kind regards,", "Best regards,", "Warm regards,", "Take care,", "Best,"];

function slug(part: string): string {
  return part.replace(/[^a-zA-Z-]/g, "").toLowerCase();
}

function deriveEmail(fullName: string): string {
  const [first] = fullName.trim().split(/\s+/);
  const f = slug(first ?? "");
  return f ? `${f}@edencaremedical.com` : "[firstname]@edencaremedical.com";
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

type SignatureFields = {
  closing: string;
  fullName: string;
  jobTitle: string;
  entity: string;
  phone: string;
  email: string;
};

function buildPlainSignature({ closing, fullName, jobTitle, entity, phone, email }: SignatureFields): string {
  const closingLine = closing.trim() || "[Closing line]";
  const name = fullName.trim() || "[Full Name]";
  const title = jobTitle.trim() || "[Job Title]";
  const entityValue = entity.trim() || "[Entity / Department]";
  const phoneValue = phone.trim() || "[Phone Number]";
  const emailValue = email.trim() || "[firstname]@edencaremedical.com";
  return [
    closingLine,
    "",
    name,
    `${title} | ${entityValue}`,
    "",
    `M: ${phoneValue}`,
    "",
    `E: ${emailValue}`,
    `${TAGLINE_PREFIX}${TAGLINE}`,
    `W: ${EDEN_URL}   W: ${GINJA_URL}`,
  ].join("\n");
}

function buildHtmlSignature({ closing, fullName, jobTitle, entity, phone, email }: SignatureFields): string {
  const closingLine = escapeHtml(closing.trim() || "[Closing line]");
  const name = escapeHtml(fullName.trim() || "[Full Name]");
  const title = escapeHtml(jobTitle.trim() || "[Job Title]");
  const entityValue = escapeHtml(entity.trim() || "[Entity / Department]");
  const phoneValue = escapeHtml(phone.trim() || "[Phone Number]");
  const emailValue = escapeHtml(email.trim() || "[firstname]@edencaremedical.com");

  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#222222;">
<div>${closingLine}</div>
<div>&nbsp;</div>
<div style="font-weight:700;">${name}</div>
<div>${title} | ${entityValue}</div>
<div>&nbsp;</div>
<div>M: ${phoneValue}</div>
<div>&nbsp;</div>
<div>E: <a href="mailto:${emailValue}" style="color:#1f7a72;text-decoration:underline;">${emailValue}</a></div>
<div>${TAGLINE_PREFIX}<span style="font-weight:700;font-style:italic;">${TAGLINE}</span></div>
<div>W: <a href="${EDEN_URL}" style="color:#1f7a72;text-decoration:underline;">${EDEN_URL}</a>&nbsp;&nbsp;&nbsp;&nbsp;W: <a href="${GINJA_URL}" style="color:#e8622c;text-decoration:underline;">${GINJA_URL}</a></div>
<div style="margin-top:10px;">
<img src="${SITE_URL}/logos/eden-care-logo.png" alt="Eden Care" height="22" style="height:22px;width:auto;vertical-align:middle;margin-right:14px;border:0;" />
<img src="${SITE_URL}/logos/ginja-ai-logo.png" alt="Ginja.ai" height="20" style="height:20px;width:auto;vertical-align:middle;border:0;" />
</div>
</div>`;
}

export function SignatureGenerator() {
  const [closing, setClosing] = useState("");
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [entity, setEntity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const emailPlaceholder = fullName.trim() ? deriveEmail(fullName) : "[firstname]@edencaremedical.com";
  const resolvedEmail = email.trim() || (fullName.trim() ? deriveEmail(fullName) : "");

  const fields: SignatureFields = { closing, fullName, jobTitle, entity, phone, email: resolvedEmail };
  const plainSignature = useMemo(
    () => buildPlainSignature(fields),
    [closing, fullName, jobTitle, entity, phone, resolvedEmail]
  );
  const htmlSignature = useMemo(
    () => buildHtmlSignature(fields),
    [closing, fullName, jobTitle, entity, phone, resolvedEmail]
  );

  async function handleCopy() {
    try {
      if (typeof ClipboardItem !== "undefined") {
        const item = new ClipboardItem({
          "text/html": new Blob([htmlSignature], { type: "text/html" }),
          "text/plain": new Blob([plainSignature], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(plainSignature);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      try {
        await navigator.clipboard.writeText(plainSignature);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      } catch {
        // Clipboard API unavailable (e.g. insecure context) - nothing else to do.
      }
    }
  }

  return (
    <div>
      <datalist id="closing-presets">
        {CLOSING_PRESETS.map((preset) => (
          <option key={preset} value={preset} />
        ))}
      </datalist>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input
          value={closing}
          onChange={(e) => setClosing(e.target.value)}
          list="closing-presets"
          placeholder="Closing line (e.g. Kind regards,)"
          className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm bg-white"
        />
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
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          placeholder="Entity / Department (e.g. Eden Care Group Holding INC)"
          className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm bg-white"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. +27 71 309 8448"
          className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm bg-white"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={emailPlaceholder}
          className="w-full px-3 py-2 rounded-lg border border-borderc focus-ring outline-none text-sm bg-white"
        />
      </div>

      <div className="mt-5 card p-6 border-teal/30">
        <h2 className="font-semibold text-charcoal">Signature preview</h2>
        <p className="mt-1 text-xs text-graylight">
          Both website links and the dual-brand logos are already included - just fill in your
          details and copy.
        </p>

        <div className="mt-4 bg-cream-alt rounded-lg p-4 text-sm">
          <p className="text-graytxt">{closing.trim() || "[Closing line]"}</p>
          <p className="mt-2 font-bold text-charcoal">{fullName.trim() || "[Full Name]"}</p>
          <p className="text-graytxt">
            {jobTitle.trim() || "[Job Title]"} | {entity.trim() || "[Entity / Department]"}
          </p>
          <p className="mt-2 text-graytxt">M: {phone.trim() || "[Phone Number]"}</p>
          <p className="mt-2 text-graytxt">
            E:{" "}
            <a
              href={`mailto:${resolvedEmail || emailPlaceholder}`}
              className="text-teal underline"
            >
              {resolvedEmail || "[firstname]@edencaremedical.com"}
            </a>
          </p>
          <p className="text-graytxt">
            {TAGLINE_PREFIX}
            <span className="font-bold italic">{TAGLINE}</span>
          </p>
          <p className="text-graytxt">
            W:{" "}
            <a href={EDEN_URL} target="_blank" rel="noreferrer" className="text-teal underline">
              {EDEN_URL}
            </a>
            {"    "}
            W:{" "}
            <a href={GINJA_URL} target="_blank" rel="noreferrer" className="text-orange underline">
              {GINJA_URL}
            </a>
          </p>
          <div className="mt-3 flex items-center gap-4">
            <EdenCareLogo className="h-6 w-auto" />
            <GinjaAiLogo className="h-5 w-auto" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-graytxt mb-1.5">
              Download logos
              <span className="font-normal text-graylight"> - for clients that strip pasted images</span>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/logos/eden-care-logo.png"
                download
                className="inline-flex items-center gap-1 text-xs text-graytxt hover:text-teal transition-colors"
              >
                <Download size={13} /> Eden Care logo
              </a>
              <a
                href="/logos/ginja-ai-logo.png"
                download
                className="inline-flex items-center gap-1 text-xs text-graytxt hover:text-orange transition-colors"
              >
                <Download size={13} /> Ginja.ai logo
              </a>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors focus-ring bg-teal text-white hover:bg-teal-dark"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied!" : "Copy signature"}
          </button>
        </div>
      </div>
    </div>
  );
}
