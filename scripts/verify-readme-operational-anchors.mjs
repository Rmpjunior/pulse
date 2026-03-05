import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readmePath = resolve(process.cwd(), "README.md");
const raw = readFileSync(readmePath, "utf8");

const sectionStart = raw.indexOf("## Índice operacional rápido");
if (sectionStart === -1) {
  console.error("Índice operacional rápido não encontrado no README.md");
  process.exit(1);
}

const nextSection = raw.indexOf("\n## ", sectionStart + 1);
const section = raw.slice(sectionStart, nextSection === -1 ? raw.length : nextSection);

const anchorRefs = [...section.matchAll(/\[[^\]]+\]\(#([^)]+)\)/g)].map((m) => m[1]);

const missing = anchorRefs.filter((id) => !raw.includes(`<a id="${id}"></a>`));

if (missing.length > 0) {
  console.error("Âncoras ausentes para o índice operacional:");
  for (const id of missing) console.error(`- ${id}`);
  process.exit(1);
}

console.log(`OK: ${anchorRefs.length} âncoras do índice operacional validadas.`);
