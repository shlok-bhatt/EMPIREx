import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const outputDir = resolve(process.argv[2] || "_site");
const baseUrl = "/EMPIREx";
const routes = [
  "/", "/shop/", "/how-to-play/", "/categories/", "/customer/", "/action/", "/event/",
  "/ability/", "/secret-goal/", "/business/", "/market-pulse/", "/schools/", "/about/",
  "/future-editions/", "/faq/", "/contact/", "/privacy/", "/terms/", "/404.html"
];
const errors = [];
const fail = (message) => errors.push(message);
const outputFileFor = (route) => {
  if (route === "/") return join(outputDir, "index.html");
  if (route === "/404.html") return join(outputDir, "404.html");
  return join(outputDir, route.replace(/^\\//, "").replace(/\\/$/, ""), "index.html");
};

for (const route of routes) {
  const file = outputFileFor(route);
  if (!existsSync(file)) { fail("Missing generated page for " + route); continue; }
  const html = readFileSync(file, "utf8");
  if (!/<!doctype html>/i.test(html)) fail(route + ": missing doctype");
  if (!/<main id="main-content">/i.test(html)) fail(route + ": main landmark missing");
  if ((html.match(/<header class="site-header">/gi) || []).length !== 1) fail(route + ": expected one shared header");
  if ((html.match(/<footer class="site-footer">/gi) || []).length !== 1) fail(route + ": expected one shared footer");
  if (html.includes("{{") || html.includes("{%")) fail(route + ": unresolved Liquid template syntax");
  if ((html.match(/<h1\\b/gi) || []).length !== 1) fail(route + ": expected exactly one H1");
  if (!/<title>[^<]+<\\/title>/i.test(html)) fail(route + ": title missing");
  const canonical = "https://shlok-bhatt.github.io" + baseUrl + (route === "/" ? "/" : route);
  const canonicalMatches = [...html.matchAll(/<link rel="canonical" href="([^"]+)"\\s*\\/?\\s*>/gi)];
  if (canonicalMatches.length !== 1 || canonicalMatches[0]?.[1] !== canonical) fail(route + ": canonical URL missing, duplicated or incorrect");
  const description = html.match(/<meta name="description" content="([^"]*)"/i);
  if (!description?.[1]?.trim()) fail(route + ": SEO description missing");
  for (const pattern of [
    /property="og:title" content="[^"]+"/i, /property="og:description" content="[^"]+"/i,
    /property="og:url" content="[^"]+"/i, /property="og:image" content="[^"]+"/i,
    /name="twitter:card" content="summary_large_image"/i, /name="theme-color" content="[^"]+"/i
  ]) if (!pattern.test(html)) fail(route + ": required social or browser metadata missing");
  if (!html.includes("/EMPIREx/assets/css/flagship.css")) fail(route + ": flagship stylesheet missing");
  if (!html.includes('aria-label="Main navigation"')) fail(route + ": main navigation missing");
  if (!html.includes('id="menu-toggle"') || !html.includes('aria-expanded="false"')) fail(route + ": mobile navigation accessibility attributes missing");

  for (const tag of [...html.matchAll(/<img\\b[^>]*>/gi)].map((match) => match[0])) {
    if (!/\\balt=["'][^"']*["']/i.test(tag)) fail(route + ": image is missing alt text");
  }
  for (const tag of [...html.matchAll(/<a\\b[^>]*target="_blank"[^>]*>/gi)].map((match) => match[0])) {
    const rel = (tag.match(/\\brel="([^"]*)"/i) || [])[1] || "";
    if (!/(?:^|\\s)noopener(?:\\s|$)/i.test(rel)) fail(route + ": new-tab link missing rel=noopener");
  }
}

const shopFile = outputFileFor("/shop/");
if (existsSync(shopFile)) {
  const shop = readFileSync(shopFile, "utf8");
  for (const text of ["Investor demonstration only.", "Add to demo cart", "checkout-preview", "Not collected in this prototype", "Review demo summary", "No order has been placed"]) {
    if (!shop.includes(text)) fail("Shop: required prototype notice or screen missing: " + text);
  }
  if (/<form\\b|<input\\b|<select\\b|<textarea\\b/i.test(shop)) fail("Shop: the investor prototype must not collect customer data");
  if (!shop.includes('type="application/ld+json"') || shop.includes('"@type": "Offer"')) fail("Shop: product metadata must not imply an active purchasable Offer");
}
const homeFile = outputFileFor("/");
if (existsSync(homeFile)) {
  const home = readFileSync(homeFile, "utf8");
  if (!home.includes("Don't just learn business.") || !home.includes("73.6%") || !home.includes("64 of 87")) fail("Home: core positioning or qualified survey finding missing");
  if ((home.match(/class="category-tile"/g) || []).length !== 6) fail("Home: expected six card family previews");
  if (!home.includes("/EMPIREx/shop/")) fail("Home: product Shop pathway missing");
}
const howFile = outputFileFor("/how-to-play/");
if (existsSync(howFile)) {
  const html = readFileSync(howFile, "utf8");
  if ((html.match(/class="rule-step"/g) || []).length !== 8) fail("How to Play: expected eight ordered steps");
  for (const text of ["max(0, C + E)", "Perfect Match", "Highest total EP wins"]) if (!html.includes(text)) fail("How to Play: missing key game rule " + text);
}

for (const route of routes) {
  const file = outputFileFor(route);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  const refs = [...html.matchAll(/\\b(?:href|src)="([^"]+)"/gi)].map((match) => match[1]);
  for (const ref of refs) {
    if (!ref.startsWith(baseUrl + "/") && ref !== baseUrl + "/") continue;
    const path = ref.split("?")[0].split("#")[0].slice(baseUrl.length);
    const candidate = !path ? join(outputDir, "index.html") :
      path.endsWith("/") ? join(outputDir, path.replace(/^\\//, ""), "index.html") :
      join(outputDir, path.replace(/^\\//, ""));
    if (!existsSync(candidate)) fail(route + ": broken generated local target " + ref);
  }
}
for (const asset of ["robots.txt", "sitemap.xml", "assets/empirex-social.svg", "store-demo.js", "assets/css/flagship.css"]) {
  if (!existsSync(join(outputDir, asset))) fail("Generated asset missing: " + asset);
}
const notFound = readFileSync(outputFileFor("/404.html"), "utf8");
if (!/name="robots" content="noindex,follow"/i.test(notFound)) fail("404 must remain noindex");

if (errors.length) {
  console.error("EMPIREx built-site checks failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("EMPIREx built-site checks passed: " + routes.length + " routes, metadata, core content, prototype safety and all generated local targets.");
