"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";

type DocumentTemplate = {
  name: string;
  description: string;
  fileLabel: string;
  href: string;
};

const TEMPLATES_BY_BRAND: Record<string, DocumentTemplate[]> = {
  "Ginja.ai": [
    {
      name: "Ginja.ai header & footer",
      description:
        "Ready-made Word header and footer in the dual-brand format - use it as the starting point for Ginja.ai letters and documents.",
      fileLabel: "GinjaTemplateHeaderFooter.docx",
      href: "/templates/GinjaTemplateHeaderFooter.docx",
    },
  ],
  "Eden Care": [],
};

const BRANDS = Object.keys(TEMPLATES_BY_BRAND);

export function DocumentTemplates() {
  const [activeBrand, setActiveBrand] = useState(BRANDS[0]);
  const templates = TEMPLATES_BY_BRAND[activeBrand];

  return (
    <div className="mt-4">
      <div className="flex gap-1 border-b border-borderc">
        {BRANDS.map((brand) => (
          <button
            key={brand}
            onClick={() => setActiveBrand(brand)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors focus-ring ${
              activeBrand === brand
                ? "border-teal text-teal"
                : "border-transparent text-graytxt hover:text-charcoal"
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {templates.length === 0 ? (
          <p className="text-sm text-graylight">No templates yet for {activeBrand} - check back soon.</p>
        ) : (
          templates.map((template) => (
            <div key={template.href} className="card p-5 flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <FileText size={20} className="text-teal shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm text-charcoal">{template.name}</h3>
                  <p className="mt-1 text-xs text-graytxt">{template.description}</p>
                </div>
              </div>
              <a
                href={template.href}
                download
                className="mt-4 inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full text-xs font-medium bg-teal text-white hover:bg-teal-dark transition-colors focus-ring"
              >
                <Download size={13} /> Download {template.fileLabel}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
