import { existsSync, readFileSync } from "node:fs";
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

const links = [...section.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((m) => m[1]);

const missingLocalAnchors = [];
const missingFileAnchors = [];
const missingFiles = [];

for (const href of links) {
  if (href.startsWith("#")) {
    const id = href.slice(1);
    if (!raw.includes(`<a id="${id}"></a>`)) {
      missingLocalAnchors.push(id);
    }
    continue;
  }

  if (href.includes("#")) {
    const [relativePath, anchor] = href.split("#");
    const targetPath = resolve(process.cwd(), relativePath);

    if (!existsSync(targetPath)) {
      missingFiles.push(relativePath);
      continue;
    }

    const targetRaw = readFileSync(targetPath, "utf8");
    if (!targetRaw.includes(`<a id="${anchor}"></a>`)) {
      missingFileAnchors.push(`${relativePath}#${anchor}`);
    }
  }
}

if (
  missingLocalAnchors.length > 0 ||
  missingFileAnchors.length > 0 ||
  missingFiles.length > 0
) {
  console.error("Falha na validação de links do índice operacional:");

  if (missingLocalAnchors.length > 0) {
    console.error("- Âncoras locais ausentes no README:");
    for (const id of missingLocalAnchors) console.error(`  - ${id}`);
  }

  if (missingFiles.length > 0) {
    console.error("- Arquivos de destino não encontrados:");
    for (const file of missingFiles) console.error(`  - ${file}`);
  }

  if (missingFileAnchors.length > 0) {
    console.error("- Âncoras ausentes em arquivos referenciados:");
    for (const ref of missingFileAnchors) console.error(`  - ${ref}`);
  }

  process.exit(1);
}

console.log(`OK: ${links.length} links do índice operacional validados.`);
