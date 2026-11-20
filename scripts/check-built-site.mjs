import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const outputDir = resolve(process.argv[2] || "_site");
const baseUrl = "/EMPIREx";
const routes = [
  "/", "/how-to-play/", "/categories/", "/customer/", "/action/", "/event/",
  "/ability/", "/secret-goal/", "/business/", "/market-pulse/", "/schools/",
  "/about/", "/future-editions/", "/faq/", "/contact/", "/privacy/", "/terms/", "/404.html"
];
const errors = [];
const fail = (message) => errors.push(message);
const outputFileFor = (route) => {
  if (route === "/") return join(outputDir, "index.html");
  if (route === "/404.html") return join(outputDir, "404.html");
  return join(outputDir, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
};

for (const route of routes) {
  const file = outputFileFor(route);
  if (!existsSync(file)) {
    fail("Missing generated page for " + route + ": " + file);
    continue;
  }
  const html = readFileSync(file, "utf8");
  if (!/<!doctype html>/i.test(html)) fail(route + ": missing doctype");
  if (!/<main id="main-content">/i.test(html)) fail(route + ": shared main landmark missing");
  if ((html.match(/<header class="site-header">/gi) || []).length !== 1) fail(route + ": expected exactly one shared header");
  if ((html.match(/<footer class="site-footer">/gi) || []).length !== 1) fail(route + ": expected exactly one shared footer");
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(route + ": page title is missing");
  if (html.includes("{{") || html.includes("{%")) fail(route + ": unresolved Liquid syntax remains in generated HTML");
  const canonical = "https://shlok-bhatt.github.io" + baseUrl + (route === "/" ? "/" : route);
  if (!html.includes(canonical)) fail(route + ": canonical URL does not include the configured base URL");
  if (!html.includes('<link rel="stylesheet"')) fail(route + ": stylesheet links missing");
  if (!html.includes('aria-label="Main navigation"')) fail(route + ": shared primary navigation missing");
}


const homePath = outputFileFor("/");
if (existsSync(homePath)) {
  const homeHtml = readFileSync(homePath, "utf8");
  const count = (pattern) => (homeHtml.match(pattern) || []).length;
  if (count(/<h1\b/gi) !== 1) fail("Home page: expected exactly one H1 heading");
  if (count(/class="home-feature-card"/g) !== 3) fail("Home page: expected three featured card links");
  if (count(/class="home-round-card"/g) !== 4) fail("Home page: expected four round-step cards");
  if (count(/class="home-fact"/g) !== 4) fail("Home page: expected four product facts");
  if (count(/class="home-audience-card"/g) !== 3) fail("Home page: expected three audience pathways");
  if (count(/class="category-tile"/g) !== 6) fail("Home page: expected all six card-family tiles");
  if (!homeHtml.includes("73.6%") || !homeHtml.includes("64 of 87")) fail("Home page: internal survey figure is missing");
  if (!homeHtml.includes("not a representative national study")) fail("Home page: internal survey qualification is missing");
  if (!homeHtml.includes("₹599") || !homeHtml.includes("₹549")) fail("Home page: centrally configured displayed prices are missing");
  if (!homeHtml.includes("/EMPIREx/assets/css/homepage.css")) fail("Home page: homepage stylesheet is missing from the rendered page");
}

const localTargets = new Set();
for (const route of routes) {
  const htmlPath = outputFileFor(route);
  if (!existsSync(htmlPath)) continue;
  const html = readFileSync(htmlPath, "utf8");
  const attrs = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const target of attrs) {
    if (!target.startsWith(baseUrl + "/") && target !== baseUrl + "/") continue;
    const path = target.split("?")[0].split("#")[0].slice(baseUrl.length);
    if (!path) {
      localTargets.add(join(outputDir, "index.html"));
      continue;
    }
    const candidate = path.endsWith("/")
      ? join(outputDir, path.replace(/^\//, ""), "index.html")
      : join(outputDir, path.replace(/^\//, ""));
    localTargets.add(candidate);
    if (!existsSync(candidate)) fail("Broken generated internal link or asset: " + target);
  }
}

if (errors.length) {
  console.error("EMPIREx built-site checks failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("EMPIREx built-site checks passed: " + routes.length + " published pages and " + localTargets.size + " local targets checked.");
