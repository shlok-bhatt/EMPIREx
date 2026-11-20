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


const howToFile = outputFileFor("/how-to-play/");
if (existsSync(howToFile)) {
  const html = readFileSync(howToFile, "utf8");
  const countSteps = (html.match(/<article class="rule-step">/g) || []).length;
  if (countSteps !== 8) fail("How to Play: expected eight ordered round steps, found " + countSteps);
  for (const phrase of ["max(0, C + E)", "Ability card and keep it visible", "Customer score", "Event modifier", "Business bonus", "Ability bonus", "Perfect Match", "Return all three Market Pulse cards and shuffle", "Highest total EP wins"]) {
    if (!html.includes(phrase)) fail("How to Play: missing rendered rule or scoring content: " + phrase);
  }
  if (!html.includes("/EMPIREx/assets/css/product-experience.css")) fail("How to Play: Phase 4 stylesheet is missing");
}

const cardsFile = outputFileFor("/categories/");
if (existsSync(cardsFile)) {
  const html = readFileSync(cardsFile, "utf8");
  if ((html.match(/class="showcase-card"/g) || []).length !== 6) fail("Cards page: expected six original artwork showcase links");
  if ((html.match(/class="category-tile"/g) || []).length !== 6) fail("Cards page: expected six card-family detail tiles");
  for (const key of ["market-pulse-a.svg", "market-pulse-b.svg", "market-pulse-c.svg"]) {
    if (!html.includes(key)) fail("Cards page: missing Market Pulse selector artwork " + key);
  }
  if (!html.includes("separate three-card selector")) fail("Cards page: Market Pulse must be distinguished from the six main card families");
}

const pulseFile = outputFileFor("/market-pulse/");
if (existsSync(pulseFile)) {
  const html = readFileSync(pulseFile, "utf8");
  if ((html.match(/class="market-pulse-selector"/g) || []).length !== 3) fail("Market Pulse: expected three selector cards");
  if ((html.match(/<article><span>0[1-5]<\/span>/g) || []).length !== 5) fail("Market Pulse: expected five steps in the reveal sequence");
  for (const phrase of ["face down", "revealed together", "Customer scoring profile", "return all three Market Pulse cards"]) {
    if (!html.includes(phrase)) fail("Market Pulse: missing required reveal rule: " + phrase);
  }
  if (!html.includes("/EMPIREx/assets/css/product-experience.css")) fail("Market Pulse: Phase 4 stylesheet is missing");
}

const cardRoutes = [
  ["/customer/", "Customer"], ["/action/", "Action"], ["/event/", "Event"],
  ["/ability/", "Ability"], ["/secret-goal/", "Secret Goal"], ["/business/", "Business"]
];
for (const [route, title] of cardRoutes) {
  const file = outputFileFor(route);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  if (!html.includes("<h1>" + title + " <em>cards.</em></h1>")) fail(route + ": expected the correct card-family heading");
  if (!html.includes("card-experience-grid") || !html.includes("Rule to remember")) fail(route + ": shared card detail layout is incomplete");
  const mechanicCount = (html.match(/class="card-mechanics-list"/g) || []).length;
  if (mechanicCount !== 1) fail(route + ": shared card mechanics list is missing");
  if (!html.includes("Read the complete round rules")) fail(route + ": link to the full game rules is missing");
  if (!html.includes("/EMPIREx/assets/css/product-experience.css")) fail(route + ": Phase 4 stylesheet is missing");
}


const supportingRoutes = [
  ["/schools/", "Schools"], ["/about/", "About"], ["/future-editions/", "Future editions"],
  ["/faq/", "FAQs"], ["/contact/", "Contact"], ["/privacy/", "Privacy"],
  ["/terms/", "Terms"], ["/404.html", "Not found"]
];
for (const [route, label] of supportingRoutes) {
  const file = outputFileFor(route);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  if ((html.match(/<h1\\b/gi) || []).length !== 1) fail(label + ": expected exactly one H1 heading");
  if (!html.includes("/EMPIREx/assets/css/supporting-pages.css")) fail(label + ": Phase 5 supporting stylesheet is missing");
}
const schoolsHtml = existsSync(outputFileFor("/schools/")) ? readFileSync(outputFileFor("/schools/"), "utf8") : "";
if (schoolsHtml) {
  if (!schoolsHtml.includes("13–17") || !schoolsHtml.includes("supplementary activity")) fail("Schools: intended learner range or supplementary-use explanation is missing");
  if ((schoolsHtml.match(/class="school-use-card"/g) || []).length !== 3) fail("Schools: expected three classroom-use steps");
  if ((schoolsHtml.match(/class="school-focus-grid"/g) || []).length !== 1) fail("Schools: possible learning focus section is missing");
}
const aboutHtml = existsSync(outputFileFor("/about/")) ? readFileSync(outputFileFor("/about/"), "utf8") : "";
if (aboutHtml && (aboutHtml.match(/class="team-card"/g) || []).length !== 3) fail("About: expected all three founding team profiles");
const futureHtml = existsSync(outputFileFor("/future-editions/")) ? readFileSync(outputFileFor("/future-editions/"), "utf8") : "";
if (futureHtml) {
  if ((futureHtml.match(/class="future-card(?:\\s|")/g) || []).length !== 30) fail("Future editions: expected 30 concept cards across the six sections");
  for (const id of ["expansion-packs", "regional-editions", "subject-editions", "digital-experience", "industry-packs", "school-experiences"]) {
    if (!futureHtml.includes('id="' + id + '"')) fail("Future editions: missing section " + id);
  }
  if (!futureHtml.includes("not a pre-order or reservation list")) fail("Future editions: the concept-only and no-preorder explanation is missing");
}
const faqHtml = existsSync(outputFileFor("/faq/")) ? readFileSync(outputFileFor("/faq/"), "utf8") : "";
if (faqHtml) {
  if ((faqHtml.match(/<details>/g) || []).length < 12) fail("FAQs: expected at least twelve question-and-answer entries");
  if ((faqHtml.match(/class="faq-group"/g) || []).length !== 4) fail("FAQs: expected four topic groups");
}
const contactHtml = existsSync(outputFileFor("/contact/")) ? readFileSync(outputFileFor("/contact/"), "utf8") : "";
if (contactHtml) {
  if ((contactHtml.match(/class="contact-person-card"/g) || []).length !== 3) fail("Contact: expected three team contact cards");
  for (const email of ["shlok.bhatt@shikhaacademy.org", "sahil.maurya@shikhaacademy.org", "anuj.bhagat@shikhaacademy.org"]) {
    if (!contactHtml.includes("mailto:" + email)) fail("Contact: missing mailto link for " + email);
  }
}
const privacyHtml = existsSync(outputFileFor("/privacy/")) ? readFileSync(outputFileFor("/privacy/"), "utf8") : "";
if (privacyHtml && (!privacyHtml.includes("Google Fonts") || !privacyHtml.includes("GitHub Pages") || !privacyHtml.includes("does not have user accounts"))) {
  fail("Privacy: hosting, external font and account disclosures are missing");
}
const termsHtml = existsSync(outputFileFor("/terms/")) ? readFileSync(outputFileFor("/terms/"), "utf8") : "";
if (termsHtml && (!termsHtml.includes("₹599") || !termsHtml.includes("₹549") || !termsHtml.includes("not pre-orders"))) {
  fail("Terms: central prices or future-concept purchasing caveat are missing");
}
const notFoundHtml = existsSync(outputFileFor("/404.html")) ? readFileSync(outputFileFor("/404.html"), "utf8") : "";
if (notFoundHtml && (notFoundHtml.match(/class="not-found-link-grid"/g) || []).length !== 1) fail("404: helpful navigation grid is missing");

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
