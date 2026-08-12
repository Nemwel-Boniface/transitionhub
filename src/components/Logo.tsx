import Image from "next/image";

export function EdenCareLogo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/logos/eden-care-logo.png"
      alt="Eden Care"
      width={292}
      height={87}
      className={className}
      priority
    />
  );
}

export function GinjaAiLogo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/logos/ginja-ai-logo.png"
      alt="Ginja.ai"
      width={800}
      height={268}
      className={className}
      priority
    />
  );
}

/** The two marks side by side, divided by the brand split rule - the app's masthead lockup. */
export function DualBrandLockup() {
  return (
    <div className="flex items-center gap-3">
      <EdenCareLogo className="h-6 w-auto sm:h-7" />
      <span className="h-5 w-px bg-borderc" aria-hidden />
      <GinjaAiLogo className="h-5 w-auto sm:h-6" />
    </div>
  );
}
