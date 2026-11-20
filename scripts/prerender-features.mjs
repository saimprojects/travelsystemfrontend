import { readFile, writeFile } from 'node:fs/promises';
import { renderFeatures } from '../dist-ssr/entry-features.js';
import { featuresMetadata, headAttributes } from '../src/featureMetadata.js';

const root = '<div id="root"></div>';
const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

let html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
if (!html.includes(root)) throw new Error('Missing TAM app root in built HTML');

const titlePattern = /<title>[^<]*<\/title>/;
if (!titlePattern.test(html)) throw new Error('Missing TAM page title in built HTML');
html = html.replace(titlePattern, () => `<title>${escapeHtml(featuresMetadata.title)}</title>`);

for (const [tag, attribute, key, valueAttribute, value] of headAttributes(featuresMetadata)) {
  const pattern = new RegExp(`<${tag} ${attribute}="${key}" ${valueAttribute}="[^"]*"\\s*\\/?>`);
  if (!pattern.test(html)) throw new Error(`Missing expected head tag for ${featuresMetadata.url}: ${pattern}`);
  html = html.replace(pattern, () => `<${tag} ${attribute}="${key}" ${valueAttribute}="${escapeHtml(value)}" />`);
}

// Homepage structured data describes a different page and should stay there.
html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
html = html.replace(root, () => `<div id="root">${renderFeatures()}</div>`);

await writeFile(new URL('../dist/features.html', import.meta.url), html);
