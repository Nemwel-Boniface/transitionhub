import { describe, it, expect, beforeEach, afterAll } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";

// Point the local file store at a throwaway temp directory for this test run.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "th-test-"));
const originalCwd = process.cwd();
process.chdir(tmpDir);

const { createFaq, listFaqs, updateFaq, deleteFaq } = await import("@/lib/db/faqs");

describe("faqs data layer (local file-backed store)", () => {
  beforeEach(() => {
    const dbFile = path.join(tmpDir, ".data", "local-db.json");
    if (fs.existsSync(dbFile)) fs.rmSync(dbFile);
  });

  afterAll(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("creates and lists a FAQ", async () => {
    await createFaq({ question: "Q1", answer: "A1", category: "Strategy", tags: ["x"] });
    const faqs = await listFaqs();
    expect(faqs).toHaveLength(1);
    expect(faqs[0].question).toBe("Q1");
  });

  it("updates a FAQ", async () => {
    const faq = await createFaq({ question: "Q2", answer: "A2", category: "Strategy" });
    const updated = await updateFaq(faq.id, { answer: "Updated answer" });
    expect(updated?.answer).toBe("Updated answer");
  });

  it("deletes a FAQ", async () => {
    const faq = await createFaq({ question: "Q3", answer: "A3", category: "Strategy" });
    const ok = await deleteFaq(faq.id);
    expect(ok).toBe(true);
    const faqs = await listFaqs();
    expect(faqs.find((f) => f.id === faq.id)).toBeUndefined();
  });
});
