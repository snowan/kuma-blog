import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(import.meta.dirname, "../../src/styles/global.css"), "utf8");

function block(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  if (!match) throw new Error(`Missing token block: ${selector}`);
  return Object.fromEntries(
    [...match[1].matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((item) => [item[1], item[2]]),
  );
}

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => Number.parseInt(value, 16) / 255);
  const linear = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(foreground, background) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

const journal = block(":root");
const presentations = {
  journal,
  control: { ...journal, ...block(':root[data-presentation="control"]') },
  mori: { ...journal, ...block(':root[data-presentation="mori"]') },
};

let failed = false;
for (const [name, tokens] of Object.entries(presentations)) {
  for (const background of ["paper", "surface"]) {
    for (const foreground of ["ink", "muted", "primary"]) {
      const ratio = contrast(tokens[foreground], tokens[background]);
      if (ratio < 4.5) {
        failed = true;
        console.error(`${name}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1; expected 4.5:1`);
      }
    }
  }
  for (const foreground of ["secondary", "focus"]) {
    const ratio = contrast(tokens[foreground], tokens.paper);
    if (ratio < 3) {
      failed = true;
      console.error(`${name}: ${foreground} on paper is ${ratio.toFixed(2)}:1; expected 3:1`);
    }
  }
}

if (failed) process.exitCode = 1;
else console.log("verify-contrast: all presentation token pairs meet WCAG AA thresholds");
