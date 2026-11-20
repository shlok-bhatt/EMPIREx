import { createServer } from "node:http";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const root = resolve(process.argv[2] || "_site");
if (!existsSync(join(root, "index.html"))) throw new Error("Built Jekyll site not found. Run jekyll build first.");
const base = "/EMPIREx";
const routes = [
  "/", "/shop/", "/how-to-play/", "/categories/", "/customer/", "/action/", "/event/",
  "/ability/", "/secret-goal/", "/business/", "/market-pulse/", "/schools/", "/about/",
  "/future-editions/", "/faq/", "/contact/", "/privacy/", "/terms/", "/404.html"
];
const mime = {
  ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8",
  ".svg":"image/svg+xml", ".webp":"image/webp", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg",
  ".json":"application/json", ".xml":"application/xml", ".txt":"text/plain"
};

const server = createServer((request, response) => {
  try {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === base) pathname = "/";
    else if (pathname.startsWith(base + "/")) pathname = pathname.slice(base.length);
    let file = resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403); response.end("Forbidden"); return;
    }
    if (existsSync(file) && !extname(file)) file = join(file, "index.html");
    if (existsSync(file) && extname(file) === "") file = join(file, "index.html");
    if (!existsSync(file)) {
      response.writeHead(404, {"content-type":"text/plain; charset=utf-8"}); response.end("Not found"); return;
    }
    response.writeHead(200, {
      "content-type": mime[extname(file)] || "application/octet-stream",
      "cache-control":"no-store",
      "x-content-type-options":"nosniff"
    });
    response.end(readFileSync(file));
  } catch {
    response.writeHead(400); response.end("Bad request");
  }
});

await new Promise((resolveReady, reject) => {
  server.once("error", reject);
  server.listen(4173, "127.0.0.1", resolveReady);
});

const browser = await chromium.launch({ headless: true });
const errors = [];
const audit = [];
const screenshotDir = resolve("_artifacts/phase7");
mkdirSync(screenshotDir, { recursive: true });
const origin = "http://127.0.0.1:4173";
const pageUrl = (route) => origin + base + (route === "/" ? "/" : route);
const addError = (message) => errors.push(message);

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on("pageerror", (error) => addError("Browser page error: " + error.message));

  for (const route of routes) {
    const response = await page.goto(pageUrl(route), { waitUntil: "domcontentloaded" });
    if (!response || response.status() !== 200) addError(route + ": route returned " + (response?.status() ?? "no response"));
    await page.locator("main#main-content h1").waitFor({ state: "visible", timeout: 5000 }).catch(() => addError(route + ": visible main H1 missing"));
    const title = await page.title();
    if (!title.trim()) addError(route + ": document title is empty");

    await page.locator("img").evaluateAll((imgs) => imgs.forEach((img) => { img.loading = "eager"; }));
    await page.waitForFunction(() => [...document.images].every((img) => img.complete), { timeout: 12000 }).catch(() => {});
    const imageIssues = await page.locator("img").evaluateAll((imgs) =>
      imgs.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.getAttribute("src"))
    );
    if (imageIssues.length) addError(route + ": image did not load: " + imageIssues.join(", "));

    const anchorIssues = await page.evaluate(() => {
      const broken = [];
      for (const link of document.querySelectorAll('a[href^="#"]')) {
        const href = link.getAttribute("href");
        if (href && href !== "#" && !document.getElementById(decodeURIComponent(href.slice(1)))) broken.push(href);
      }
      return broken;
    });
    if (anchorIssues.length) addError(route + ": broken in-page anchors: " + anchorIssues.join(", "));

    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = axeResults.violations.filter((violation) => ["critical", "serious"].includes(violation.impact));
    audit.push({
      route,
      violations: axeResults.violations.map((v) => ({ id: v.id, impact: v.impact, description: v.help, nodes: v.nodes.length }))
    });
    for (const violation of serious) {
      addError(route + ": accessibility " + violation.impact + " — " + violation.id + " (" + violation.nodes.length + " elements)");
    }

    await page.screenshot({ path: join(screenshotDir, route === "/" ? "home-desktop.png" : route.replaceAll("/", "_").replace(/^_/, "").replace(/_$/, "") + "-desktop.png"), fullPage: true });
  }

  for (const route of ["/", "/shop/", "/categories/", "/how-to-play/", "/schools/", "/customer/"]) {
    for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pageUrl(route), { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
      }));
      if (overflow.document > overflow.viewport + 1 || overflow.body > overflow.viewport + 1) {
        addError(route + ": horizontal overflow at " + width + "px (document " + overflow.document + "px)");
      }
      if ([375, 1440].includes(width) && ["/", "/shop/", "/categories/"].includes(route)) {
        const suffix = route === "/" ? "home" : route.replaceAll("/", "");
        await page.screenshot({ path: join(screenshotDir, suffix + "-" + width + ".png"), fullPage: true });
      }
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(pageUrl("/"), { waitUntil: "domcontentloaded" });
  const menu = page.locator("#menu-toggle");
  await menu.click();
  if (await menu.getAttribute("aria-expanded") !== "true") addError("Mobile menu: aria-expanded did not become true");
  await page.keyboard.press("Escape");
  if (await menu.getAttribute("aria-expanded") !== "false") addError("Mobile menu: Escape did not close the menu");
  if (!(await menu.evaluate((element) => document.activeElement === element))) addError("Mobile menu: Escape did not restore focus to the toggle");

  await page.goto(pageUrl("/shop/"), { waitUntil: "domcontentloaded" });
  await page.locator("[data-add-to-cart]").click();
  if (!(await page.locator("#demo-cart").evaluate((dialog) => dialog.open))) addError("Shop demo cart: dialog did not open after adding the demo item");
  if ((await page.locator("[data-cart-quantity]").textContent())?.trim() !== "1") addError("Shop demo cart: initial quantity is incorrect");
  await page.locator("[data-quantity-increase]").click();
  if ((await page.locator("[data-cart-quantity]").textContent())?.trim() !== "2") addError("Shop demo cart: quantity control did not update");
  await page.locator("[data-continue-preview]").click();
  await page.locator("#checkout-preview").waitFor({ state: "visible" });
  await page.locator("[data-review-demo]").click();
  if (await page.locator("[data-demo-review]").isHidden()) addError("Shop demo: review summary did not appear");
  if (!(await page.locator("[data-review-copy]").textContent()).includes("No order has been placed")) addError("Shop demo: final notice does not clearly state that no order is placed");
  if (await page.locator("#checkout-preview input, #checkout-preview select, #checkout-preview textarea").count()) addError("Shop demo: customer input fields must not collect personal data");
  const shopAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  for (const violation of shopAxe.violations.filter((v) => ["critical", "serious"].includes(v.impact))) {
    addError("Shop interactive state: accessibility " + violation.impact + " — " + violation.id);
  }

  writeFileSync(join(screenshotDir, "accessibility-audit.json"), JSON.stringify(audit, null, 2));
  console.log("Browser audit: " + routes.length + " routes, 6 responsive page families, 10 viewport widths, mobile-menu interaction and Shop prototype journey checked.");
  console.log("Accessibility findings recorded in _artifacts/phase7/accessibility-audit.json.");
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}

if (errors.length) {
  console.error("EMPIREx browser checks failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("EMPIREx browser checks passed.");
