import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const errors = [];
const pageFiles = [
  "index.html", "shop.html", "how-to-play.html", "categories.html", "market-pulse.html",
  "schools.html", "about.html", "future-editions.html", "faq.html", "contact.html",
  "privacy.html", "terms.html", "404.html", "customer.html", "action.html", "event.html",
  "ability.html", "secret-goal.html", "business.html"
];
const routesExpected = [
  "/", "/shop/", "/how-to-play/", "/categories/", "/market-pulse/", "/schools/",
  "/about/", "/future-editions/", "/faq/", "/contact/", "/privacy/", "/terms/",
  "/404.html", "/customer/", "/action/", "/event/", "/ability/", "/secret-goal/", "/business/"
];
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const report = (message) => errors.push(message);
const value = (frontMatter, key) => {
  const line = frontMatter.split(/\r?\n/).find((entry) => entry.startsWith(key + ":"));
  if (!line) return undefined;
  return line.slice(key.length + 1).trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
};
const parsePage = (path) => {
  const source = read(path);
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) {
    report(path + ": missing YAML front matter");
    return { path, source, body: "", frontMatter: "" };
  }
  return { path, source, body: source.slice(match[0].length), frontMatter: match[1] };
};

const actualPages = readdirSync(root).filter((name) => name.endsWith(".html")).sort();
if (JSON.stringify(actualPages) !== JSON.stringify([...pageFiles].sort())) {
  report("Root HTML page set differs from the expected 19-page set. Found: " + actualPages.join(", "));
}
const pages = pageFiles.map(parsePage);
const routes = new Map();
for (const page of pages) {
  const layout = value(page.frontMatter, "layout");
  const permalink = value(page.frontMatter, "permalink");
  const title = value(page.frontMatter, "title");
  const description = value(page.frontMatter, "description");
  const activeNav = value(page.frontMatter, "active_nav");
  if (!["default", "card"].includes(layout)) report(page.path + ": unsupported or missing layout");
  if (!permalink) report(page.path + ": missing permalink");
  else if (routes.has(permalink)) report(page.path + ": duplicate permalink " + permalink);
  else routes.set(permalink, page.path);
  if (!title) report(page.path + ": missing page title");
  if (!description?.trim()) report(page.path + ": missing or empty page description");
  if (/<header class="site-header"/i.test(page.body)) report(page.path + ": duplicated shared header");
  if (/<footer class="site-footer"/i.test(page.body)) report(page.path + ": duplicated shared footer");
  if (page.body.includes("/EMPIREx/")) report(page.path + ": hard-coded project base path found");
}
if (routes.size !== 19) report("Expected 19 unique routes, found " + routes.size);
for (const route of routesExpected) if (!routes.has(route)) report("Missing expected route " + route);

const config = read("_config.yml");
if (!config.includes('baseurl: "/EMPIREx"') || !config.includes("permalink: pretty")) report("_config.yml: GitHub Pages base URL or pretty permalinks are incorrect");
const site = read("_data/site.yml");
if (!/asset_version:\s*["'][^"']+["']/.test(site)) report("_data/site.yml: asset version is missing");
if (!/mrp:\s*["']₹\d+["']/.test(site) || !/introductory:\s*["']₹\d+["']/.test(site)) report("_data/site.yml: central product prices are missing");
if (!/introductory_value:\s*\d+/.test(site)) report("_data/site.yml: numeric demo price is missing");
const navigation = read("_data/navigation.yml");
const primaryBlock = (navigation.match(/primary:\s*([\s\S]*?)\n\nfooter:/) || [])[1] || "";
const primaryKeys = [...primaryBlock.matchAll(/^[ \t]*-\s+key:\s*([\w-]+)/gm)].map((match) => match[1]);
for (const url of [...navigation.matchAll(/^\s+url:\s*(\/[^\s]+)/gm)].map((match) => match[1])) {
  if (!routes.has(url)) report("_data/navigation.yml: unpublished route " + url);
}
for (const page of pages) {
  const activeNav = value(page.frontMatter, "active_nav");
  if (activeNav && !primaryKeys.includes(activeNav)) report(page.path + ": active_nav is not in primary navigation");
}

const cardData = read("_data/cards.yml");
const cardBlocks = cardData.split(/(?=^- key: )/m).filter((block) => block.startsWith("- key: "));
const cards = cardBlocks.map((block) => ({
  key: (block.match(/^- key:\s*([\w-]+)/m) || [])[1],
  url: (block.match(/^  url:\s*(\/[^\s]+)/m) || [])[1],
  image: (block.match(/^  image:\s*(\/[^\s]+)/m) || [])[1]
}));
if (cards.length !== 6 || new Set(cards.map((card) => card.key)).size !== 6) report("_data/cards.yml: exactly six unique card families are required");
for (const card of cards) {
  if (!routes.has(card.url)) report("_data/cards.yml: missing card route " + card.url);
  if (!card.image || !exists(card.image.replace(/^\//, ""))) report("_data/cards.yml: missing card artwork for " + card.key);
}
const team = read("_data/team.yml");
if ((team.match(/^- name:/gm) || []).length !== 3) report("_data/team.yml: expected three founding team records");

const head = read("_includes/head.html");
const cssFiles = (head.match(/assign css_files = "([^"]+)"/) || [])[1]?.split(",") || [];
const imports = [...read("styles.css").matchAll(/@import url\("assets\/css\/([^?"]+)/g)].map((match) => match[1]);
if (JSON.stringify(cssFiles) !== JSON.stringify(imports)) report("styles.css and _includes/head.html CSS order must match exactly");
for (const css of [...cssFiles, "brand-foundation.css"]) {
  const path = join("assets/css", css);
  if (!exists(path)) report("Missing stylesheet " + path);
  else {
    const content = read(path);
    if ((content.match(/{/g) || []).length !== (content.match(/}/g) || []).length) report(path + ": unbalanced CSS braces");
  }
}
if (!cssFiles.includes("flagship.css")) report("_includes/head.html: flagship stylesheet is not loaded");
if (!head.includes('name="twitter:card" content="summary_large_image"') || !head.includes('property="og:image"') || !head.includes("absolute_url")) {
  report("_includes/head.html: social metadata and canonical metadata are incomplete");
}
if (!read("_layouts/default.html").includes("shop-promo.html")) report("_layouts/default.html: shared Shop pathway is missing");
if (!read("_layouts/card.html").includes("site.data.cards")) report("_layouts/card.html: card page template must remain data-driven");
if (!navigation.includes("key: shop") || !navigation.includes("url: /shop/")) report("Navigation is missing the Shop route");

const homepage = read("index.html");
for (const phrase of ["Don't just learn business.", "Make the calls.", "73.6%", "64 of 87", "not a representative national study"]) {
  if (!homepage.includes(phrase)) report("Homepage is missing required accurate positioning or survey qualification: " + phrase);
}
if (!homepage.includes("site.data.site.pricing.mrp") || !homepage.includes("site.data.site.pricing.introductory") || !homepage.includes("'/shop/'")) {
  report("Homepage must use central prices and lead to the product Shop");
}
const howTo = read("how-to-play.html");
if ((howTo.match(/<article class="rule-step">/g) || []).length !== 8) report("How to Play must retain eight ordered round steps");
for (const phrase of ["max(0, C + E)", "Perfect Match", "After Round 7", "Return all three Market Pulse cards and shuffle"]) {
  if (!howTo.includes(phrase)) report("How to Play is missing established rule: " + phrase);
}
if (!read("categories.html").includes("Market Pulse") || !read("categories.html").includes("card-showcase.html")) report("Cards page must preserve the six-family showcase and Market Pulse distinction");

const product = read("_data/product.yml");
for (const phrase of ["Physical card game", "13–17", "7", "Customer", "Action", "Event", "Ability", "Secret Goal", "Business", "must be confirmed"]) {
  if (!product.includes(phrase)) report("_data/product.yml is missing or misstates product fact: " + phrase);
}
const shop = read("shop.html");
for (const phrase of ["permalink: /shop/", "store_demo: true", "Investor demonstration only", "data-add-to-cart", "demo-cart", "checkout-preview", "No order has been placed", "Not collected in this prototype"]) {
  if (!shop.includes(phrase)) report("Shop prototype is missing a required non-transactional element: " + phrase);
}
if (/<form\b|<input\b|<select\b|<textarea\b/i.test(shop)) report("Shop prototype must not collect user data through form fields");
if (!read("store-demo.js").includes("let quantity = 0") || /localStorage|sessionStorage|fetch\s*\(|XMLHttpRequest|https?:\/\//i.test(read("store-demo.js"))) {
  report("Store demo must remain temporary in-memory state with no network or storage calls");
}
if (read("store-demo.js").includes("window.location") || read("store-demo.js").includes("location.href")) report("Store demo must not redirect to an external transaction");
const productPageHead = head;
if (!productPageHead.includes('page.store_product') || !productPageHead.includes('"@type": "Product"')) report("Product metadata block is missing");
if (productPageHead.includes('"@type": "Offer"')) report("Do not publish an active Offer for the non-transactional Store prototype");

const privacy = read("privacy.html");
if (!privacy.includes("GitHub Pages") || !privacy.includes("Google Fonts")) report("Privacy page must identify the current hosting and external font service");
const contact = read("contact.html");
for (const email of ["shlok.bhatt@shikhaacademy.org", "sahil.maurya@shikhaacademy.org", "anuj.bhagat@shikhaacademy.org"]) {
  if (!contact.includes("mailto:" + email)) report("Contact page is missing a published team email link: " + email);
}
const notFound = read("404.html");
if (!notFound.includes("noindex: true")) report("404 page must remain noindex");

for (const file of ["assets/empirex-social.svg", "robots.txt", "sitemap.xml", "package.json", "scripts/check-browser.mjs"]) {
  if (!exists(file)) report("Required launch asset or test file is missing: " + file);
}
const packageJson = JSON.parse(read("package.json"));
if (!packageJson.devDependencies?.playwright || !packageJson.devDependencies?.["@axe-core/playwright"]) report("Browser and accessibility test dependencies are missing");

for (const page of pages) {
  const body = page.body;
  const tags = [...body.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of tags) if (!/\balt=["'][^"']*["']/i.test(tag)) report(page.path + ": image without alt attribute");
  for (const tag of [...body.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)].map((match) => match[0])) {
    const rel = (tag.match(/\brel=["']([^"']*)["']/i) || [])[1] || "";
    if (!/(?:^|\s)noopener(?:\s|$)/i.test(rel)) report(page.path + ": target=_blank link must include rel=noopener");
  }
}

if (errors.length) {
  console.error("EMPIREx architecture checks failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("EMPIREx architecture checks passed: " + pages.length + " pages, " + routes.size + " unique routes, " + cards.length + " card families, " + cssFiles.length + " ordered CSS modules.");
