import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const errors = [];
const pageFiles = [
  "index.html", "how-to-play.html", "categories.html", "market-pulse.html",
  "schools.html", "about.html", "future-editions.html", "faq.html",
  "contact.html", "privacy.html", "terms.html", "404.html",
  "customer.html", "action.html", "event.html", "ability.html",
  "secret-goal.html", "business.html"
];

const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const report = (message) => errors.push(message);
const value = (frontMatter, key) => {
  const match = frontMatter.match(new RegExp("^" + key + ":\\s*(.*?)\\s*$", "m"));
  if (!match) return undefined;
  return match[1].replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
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
const expectedPages = [...pageFiles].sort();
if (JSON.stringify(actualPages) !== JSON.stringify(expectedPages)) {
  report("Root HTML page set differs from the expected set. Found: " + actualPages.join(", "));
}

const pages = pageFiles.map(parsePage);
const routes = new Map();
for (const page of pages) {
  const layout = value(page.frontMatter, "layout");
  const permalink = value(page.frontMatter, "permalink");
  const title = value(page.frontMatter, "title");
  const description = value(page.frontMatter, "description");
  const activeNav = value(page.frontMatter, "active_nav");

  if (!["default", "card"].includes(layout)) report(page.path + ": unsupported or missing layout '" + (layout || "") + "'");
  if (!permalink) report(page.path + ": missing permalink");
  else if (routes.has(permalink)) report(page.path + ": duplicate permalink " + permalink + " (also " + routes.get(permalink) + ")");
  else routes.set(permalink, page.path);
  if (!title) report(page.path + ": missing page title");
  if (description === undefined) report(page.path + ": missing page description");
  if (activeNav && !["home", "how-to-play", "cards", "market-pulse", "schools", "about", "contact"].includes(activeNav)) {
    report(page.path + ": unknown active_nav '" + activeNav + "'");
  }
  if (/<header class="site-header"/i.test(page.body)) report(page.path + ": shared site header is duplicated in page content");
  if (/<footer class="site-footer"/i.test(page.body)) report(page.path + ": shared site footer is duplicated in page content");
  if (page.body.includes("/EMPIREx/")) report(page.path + ": hard-coded project base path found; use the Jekyll base URL");
}
if (routes.size !== pageFiles.length) report("Expected " + pageFiles.length + " unique routes, found " + routes.size);

const config = read("_config.yml");
if (!config.includes('baseurl: "/EMPIREx"')) report("_config.yml: expected the GitHub Pages project base URL");
if (!config.includes("permalink: pretty")) report("_config.yml: clean pretty permalinks are not enabled");

const siteData = read("_data/site.yml");
if (!/asset_version:\s*["'][^"']+["']/.test(siteData)) report("_data/site.yml: missing asset_version");
if (!/mrp:\s*["']₹\d+["']/.test(siteData) || !/introductory:\s*["']₹\d+["']/.test(siteData)) {
  report("_data/site.yml: product price values must be centrally defined");
}

const navigation = read("_data/navigation.yml");
const primaryBlock = (navigation.match(/primary:\s*([\s\S]*?)\n\nfooter:/) || [])[1] || "";
const primaryKeys = [...primaryBlock.matchAll(/^[ \t]*-\s+key:\s*([\w-]+)/gm)].map((match) => match[1]);
const navigationUrls = [...navigation.matchAll(/^\s+url:\s*(\/[^\s]+)/gm)].map((match) => match[1]);
for (const url of navigationUrls) {
  if (!routes.has(url)) report("_data/navigation.yml: navigation URL has no matching page route: " + url);
}
for (const page of pages) {
  const activeNav = value(page.frontMatter, "active_nav");
  if (activeNav && !primaryKeys.includes(activeNav)) report(page.path + ": active_nav '" + activeNav + "' is not in primary navigation data");
}

const cardData = read("_data/cards.yml");
const cardBlocks = cardData.split(/(?=^- key: )/m).filter((block) => block.startsWith("- key: "));
const cards = cardBlocks.map((block) => ({
  key: (block.match(/^- key:\s*([\w-]+)/m) || [])[1],
  url: (block.match(/^  url:\s*(\/[^\s]+)/m) || [])[1],
  image: (block.match(/^  image:\s*(\/[^\s]+)/m) || [])[1]
}));
const cardKeys = cards.map((card) => card.key);
if (cardKeys.length !== 6 || new Set(cardKeys).size !== 6) report("_data/cards.yml: expected six unique card families, found " + cardKeys.length);
for (const card of cards) {
  if (!routes.has(card.url)) report("_data/cards.yml: card route is not published: " + card.url);
  if (!card.image || !exists(card.image.replace(/^\//, ""))) report("_data/cards.yml: card image is missing for '" + card.key + "'");
  const page = pages.find((candidate) => value(candidate.frontMatter, "card_key") === card.key);
  if (!page) report("_data/cards.yml: no card page uses key '" + card.key + "'");
  else if (value(page.frontMatter, "permalink") !== card.url) report(page.path + ": card data URL does not match the page permalink");
}
for (const page of pages.filter((candidate) => value(candidate.frontMatter, "layout") === "card")) {
  const key = value(page.frontMatter, "card_key");
  if (!cardKeys.includes(key)) report(page.path + ": card_key '" + (key || "") + "' is not defined in _data/cards.yml");
}
const teamData = read("_data/team.yml");
if ((teamData.match(/^- name:/gm) || []).length !== 3) report("_data/team.yml: expected the three listed founding team members");

const head = read("_includes/head.html");
const cssList = (head.match(/assign css_files = "([^"]+)"/) || [])[1]?.split(",") || [];
const importList = [...read("styles.css").matchAll(/@import url\("assets\/css\/([^?"]+)/g)].map((match) => match[1]);
if (!cssList.length) report("_includes/head.html: CSS module list is missing");
if (JSON.stringify(cssList) !== JSON.stringify(importList)) report("styles.css and _includes/head.html load different CSS module orders");
for (const cssFile of [...cssList, "brand-foundation.css"]) {
  const path = join("assets/css", cssFile);
  if (!exists(path)) report("Missing CSS module: " + path);
  else {
    const css = read(path);
    if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) report("Unbalanced CSS braces: " + path);
  }
}
if (!head.includes("absolute_url") || !head.includes("relative_url")) report("_includes/head.html: canonical and asset URLs must use Jekyll URL filters");
if (!read("_layouts/default.html").includes("{% include header.html %}") ||
    !read("_layouts/default.html").includes("{% include footer.html %}")) {
  report("_layouts/default.html: shared header/footer includes are missing");
}
if (!read("_layouts/card.html").includes("site.data.cards")) report("_layouts/card.html: card detail is not data-driven");

const cardTemplate = read("_layouts/card.html");
if (!cardTemplate.includes("card.mechanics") || !cardTemplate.includes("card.rule_note") || !cardTemplate.includes("card.timing")) {
  report("_layouts/card.html: the reusable card detail template must render mechanics, timing and the key rule");
}
for (const block of cardBlocks) {
  const key = (block.match(/^- key:\s*([\w-]+)/m) || [])[1] || "unknown";
  for (const field of ["role_label:", "timing:", "mechanics:", "rule_note_title:", "rule_note:"]) {
    if (!block.includes("  " + field)) report("_data/cards.yml: " + key + " is missing " + field);
  }
  const mechanicsStart = block.indexOf("  mechanics:");
  const mechanicsEnd = block.indexOf("\n  rule_note_title:", mechanicsStart);
  const mechanicsBlock = mechanicsStart >= 0 && mechanicsEnd > mechanicsStart ? block.slice(mechanicsStart, mechanicsEnd) : "";
  if ((mechanicsBlock.match(/^    - /gm) || []).length < 3) report("_data/cards.yml: " + key + " must contain at least three clear mechanics");
}

const howToPage = read("how-to-play.html");
if ((howToPage.match(/<article class="rule-step">/g) || []).length !== 8) {
  report("how-to-play.html: the round guide must contain exactly eight ordered steps");
}
for (const rulePhrase of [
  "max(0, C + E)", "three Action options from three different categories",
  "Keep the Market Pulse card hidden until every Action has been revealed",
  "matching Customer scoring profile", "announced before scoring",
  "Return all three Market Pulse cards and shuffle", "After Round 7",
  "tied, they share victory"
]) {
  if (!howToPage.includes(rulePhrase)) report("how-to-play.html: required game rule is missing: " + rulePhrase);
}
const marketPage = read("market-pulse.html");
for (const marketPhrase of [
  "market-pulse-a.svg", "market-pulse-b.svg", "market-pulse-c.svg",
  "face down", "every player has revealed their Action",
  "Customer scoring profile named by the Pulse card", "return all three Market Pulse cards and shuffle"
]) {
  if (!marketPage.includes(marketPhrase)) report("market-pulse.html: required selector or reveal detail is missing: " + marketPhrase);
}
const categoriesPage = read("categories.html");
if (!categoriesPage.includes("six main card families") ||
    !categoriesPage.includes("Market Pulse") ||
    !categoriesPage.includes("{% include card-showcase.html") ||
    !categoriesPage.includes("{% include card-grid.html")) {
  report("categories.html: the six-family directory, original artwork showcase or Market Pulse distinction is missing");
}
if (!cssList.includes("product-experience.css")) report("_includes/head.html: Phase 4 product experience stylesheet is missing");

if (!read("index.html").includes("{% include card-grid.html") ||
    !read("categories.html").includes("{% include card-grid.html")) {
  report("Homepage and Cards page must use the shared card-grid include");
}
if (!read("about.html").includes("{% include team-grid.html %}")) report("Our Story page must use the shared team-grid include");
const homepageData = read("_data/homepage.yml");
const heroGalleryBlock = (homepageData.match(/hero_gallery:\s*([\s\S]*?)\n\nround_steps:/) || [])[1] || "";
const heroCardKeys = [...heroGalleryBlock.matchAll(/^[ \t]*-\s+card_key:\s*([\w-]+)/gm)].map((match) => match[1]);
if (heroCardKeys.length !== 3 || new Set(heroCardKeys).size !== 3) {
  report("_data/homepage.yml: exactly three unique hero card keys are required");
}
for (const key of heroCardKeys) {
  if (!cardKeys.includes(key)) report("_data/homepage.yml: hero card key is not defined in _data/cards.yml: " + key);
}
const roundStepsBlock = (homepageData.match(/round_steps:\s*([\s\S]*)$/) || [])[1] || "";
const roundStepNumbers = [...roundStepsBlock.matchAll(/^[ \t]*-\s+number:\s*["']?(\d+)["']?/gm)].map((match) => match[1]);
if (roundStepNumbers.length !== 4 || new Set(roundStepNumbers).size !== 4) {
  report("_data/homepage.yml: exactly four uniquely numbered round steps are required");
}
if (!read("index.html").includes("{% include home-hero-gallery.html %}") ||
    !read("index.html").includes("{% include home-round-steps.html %}") ||
    !exists("_includes/home-hero-gallery.html") ||
    !exists("_includes/home-round-steps.html")) {
  report("Homepage must use both shared hero-gallery and round-step includes");
}
if (!read("categories.html").includes('class_name="cards-page-grid"') ||
    !exists("_includes/card-showcase.html")) {
  report("Cards page must retain the shared card-showcase include");
}
if (!read("_includes/card-grid.html").includes("include.class_name")) {
  report("Card grid include must support the homepage's product-grid variant");
}
if (!read("index.html").includes('class_name="category-grid home-card-grid"')) {
  report("Homepage must use its dedicated product-grid variant");
}
for (const pagePath of ["index.html", "faq.html", "terms.html"]) {
  const page = read(pagePath);
  if (!page.includes("site.data.site.pricing.mrp") || !page.includes("site.data.site.pricing.introductory")) {
    report(pagePath + ": product pricing must be read from _data/site.yml");
  }
}
if (!read("assets/css/brand-foundation.css").includes(".skip-link:focus")) report("Brand foundation is missing the visible keyboard skip-link style");

const staticAssetExists = (urlPath) => exists(urlPath.replace(/^\//, ""));
for (const page of pages) {
  const attributes = [...page.body.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const raw of attributes) {
    if (/^(?:https?:|mailto:|tel:|#|data:)/i.test(raw)) continue;
    const target = raw.replace("{{ site.baseurl }}", "").split("?")[0].split("#")[0];
    if (!target.startsWith("/")) continue;
    if (/\.(?:webp|svg|png|jpe?g|css|js|woff2|pdf)$/i.test(target)) {
      if (!staticAssetExists(target)) report(page.path + ": missing local asset reference " + raw);
    } else if (target.endsWith("/") && !routes.has(target)) {
      report(page.path + ": link points to an unpublished route " + raw);
    }
  }
}

if (errors.length) {
  console.error("EMPIREx architecture checks failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("EMPIREx architecture checks passed: " + pages.length + " pages, " + routes.size + " unique routes, " + cards.length + " card families, " + cssList.length + " ordered CSS modules.");
