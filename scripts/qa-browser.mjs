import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join, normalize, resolve } from "node:path";
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { sitemapRoutes, siteURL } from "./routes.mjs";
const require = createRequire(import.meta.url);
const root = resolve("out");
const port = 4175;
const baseURL = `http://127.0.0.1:${port}`;
const mime = {
  ".avif": "image/avif",
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".webp": "image/webp",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const server = createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(
      new URL(request.url ?? "/", baseURL).pathname,
    );
    if (!pathname.endsWith("/") && !extname(pathname)) {
      const info = await stat(join(root, pathname)).catch(() => null);
      if (info?.isDirectory()) {
        response.writeHead(301, { location: pathname + "/" });
        response.end(); return;
      }
    }
    if (pathname.endsWith("/")) pathname += "index.html";
    const candidate = normalize(join(root, pathname));
    if (!candidate.startsWith(root) || !(await stat(candidate)).isFile())
      throw new Error("not found");
    response.writeHead(200, {
      "content-type": mime[extname(candidate)] ?? "application/octet-stream",
    });
    response.end(await readFile(candidate));
  } catch {
    response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    response.end(await readFile(join(root, "404.html")));
  }
});


await new Promise((ready) => server.listen(port, "127.0.0.1", ready));
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined });
const routes = sitemapRoutes(root);
const blogPosts = routes.filter((route) => /^\/blog\/.+\/$/.test(route));
const developmentRoutes = ["/blog/gendio-control-board-and-radar-positioning/", "/blog/solar-panel-cleaning-robot-design-study/"];
const postsWithoutHero = ["/blog/the-second-life-of-a-product/", "/blog/in-praise-of-the-volume-knob/", "/blog/ai-without-the-jargon/"];
const figureCounts = { [developmentRoutes[0]]: 6, [developmentRoutes[1]]: 5, "/blog/the-experience-trap/": 2 };
const serviceRequestURL = "https://sajeevanveeriah.github.io/saj-service-desk/request/";
const failures = [];
const status = (page) => page.locator('[role="status"]').first();
await mkdir("/tmp/portfolio-qa", { recursive: true });
try {
  for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, reducedMotion: "reduce" });
      await context.addInitScript((value) => localStorage.setItem("sv-theme", value), theme);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const route of routes) {
        const response = await page.goto(baseURL + route, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200, route);
        assert.equal(await page.locator('a[href="/assets/Resume_Sajeevan_Veeriah.docx"]').count(), 0);
        assert.ok(await page.locator('a[href="/assets/Resume_Sajeevan_Veeriah.pdf"]').count() > 0, `${route} resume link`);
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), siteURL + route);
        assert.equal(await page.locator("main").evaluate((el) => /[–—]/.test(el.innerText)), false, `${route} contains an en or em dash`);
        await page.evaluate(async () => {
          for (const i of document.images) i.loading = "eager";
          await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
        });
        if ([390, 1440].includes(width) && theme === "light")
          await page.screenshot({ path: `/tmp/portfolio-qa/${route.replaceAll("/", "_")}-${width}.png`, fullPage: true });
        if (route === "/work/deadline-aware-runtime-assurance/")
          assert.equal(await page.getByRole("link", { name: "Read the research report on Zenodo", exact: true }).getAttribute("href"), "https://doi.org/10.5281/zenodo.22865084");
        if (route === "/work/gendio-controller/") {
          assert.equal(await page.locator(".project-trials > div").count(), 7);
          assert.equal(await page.locator("main").evaluate((el) => /\bRev\d{2}\b/.test(el.innerText)), false);
          assert.equal(await page.locator('a[href$=".zip"], a[href$=".bin"], a[href$=".kicad_pcb"], a[href$=".kicad_sch"]').count(), 0);
          assert.ok((await page.locator(".record-meta").innerText()).includes("Case study 4 of 6"));
        }
        if (route.startsWith("/blog/"))
          assert.equal(await page.locator('.site-nav a[href="/blog/"]').getAttribute("aria-current"), "page");
        if (blogPosts.includes(route)) {
          const figures = await page.locator(".blog-figure img").count();
          if (postsWithoutHero.includes(route)) assert.equal(figures, 0, route);
          else if (figureCounts[route]) assert.equal(figures, figureCounts[route], route);
          else assert.equal(figures, 1, route);
          assert.equal(await page.locator('meta[property="og:type"]').getAttribute("content"), "article");
          assert.ok((await page.locator(".blog-sources li").count()) >= (postsWithoutHero.includes(route) ? 1 : 2), `${route} sources`);
          assert.equal(await page.locator('a[href^="#"]').evaluateAll((links) => links.every((link) => document.getElementById(link.getAttribute("href").slice(1)))), true);
          if (figures) {
            const hero = await page.locator(".blog-figure img").first().getAttribute("src");
            assert.equal(await page.locator(".blog-figure a").first().getAttribute("href"), hero);
            assert.ok((await stat(join(root, hero.replace(".svg", ".png")))).size > 0);
          }
          const contentsLink = page.getByRole("navigation", { name: "In this article" }).getByRole("link").first();
          const anchor = await contentsLink.getAttribute("href");
          await contentsLink.press("Enter");
          assert.ok(page.url().endsWith(anchor));
        }
        if (route === "/blog/ai-without-the-jargon/") {
          assert.equal(await page.locator(".blog-body table").count(), 2);
          assert.equal(await page.locator(".blog-routine li").count(), 4);
          assert.equal(await page.locator(".blog-sources li").count(), 4);
        }
        if (developmentRoutes.includes(route)) {
          const downloads = await page.locator(".blog-downloads a").evaluateAll((links) => links.map((a) => a.getAttribute("href")).filter((href) => href.startsWith("/")));
          if (route === developmentRoutes[1]) assert.equal(await page.getByRole("link", { name: "Read Modular Waterless Photovoltaic Cleaning - Revision 02", exact: true }).getAttribute("href"), "https://zenodo.org/records/22865101");
          assert.equal(downloads.length, route === developmentRoutes[0] ? 3 : 4);
          for (const download of downloads) assert.ok((await stat(join(root, download))).size > 0);
        }
        const services = page.getByRole("region", { name: "Need technical help?" });
        assert.equal(await services.count(), 1, `${route} services region`);
        const requestLink = services.getByRole("link", { name: "Request a service", exact: true });
        assert.equal(await requestLink.getAttribute("href"), serviceRequestURL);
        const bounds = await requestLink.boundingBox();
        assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44);
        const result = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          images: [...document.images].every((i) => i.complete && i.naturalWidth > 0),
          logo: document.querySelector(".brand img")?.getBoundingClientRect().width >= 38,
          title: document.querySelectorAll("h1").length,
          theme: document.documentElement.dataset.theme,
          media: [...document.querySelectorAll(".project-media img, .media-frame img")].every((i) => getComputedStyle(i).objectFit === "contain"),
          smallTargets: [...document.querySelectorAll("header a, header button, header summary, .filters button, .footer-links a, .services a")]
            .filter((el) => el.offsetParent !== null)
            .map((el) => [el.textContent.trim() || el.getAttribute("aria-label"), el.getBoundingClientRect().height])
            .filter(([, h]) => h < 40),
        }));
        if (result.overflow || !result.images || !result.logo || result.title !== 1 || result.theme !== theme || !result.media || result.smallTargets.length)
          failures.push({ width, theme, route, result });
        await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
        const axe = await page.evaluate(async () => {
          const r = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } });
          return r.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }));
        });
        if (axe.length) failures.push({ width, theme, route, axe });
      }
      if (errors.length) failures.push({ width, theme, errors });
      await context.close();
    }
    console.log(`Verified ${routes.length} routes at ${width}px in light and dark`);
  }
  if (failures.length) throw new Error(JSON.stringify(failures, null, 2));
  assert.deepEqual(await readFile(join(root, "assets/Resume_Sajeevan_Veeriah.pdf")), await readFile("public/assets/Resume_Sajeevan_Veeriah.pdf"));

  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));

  // Mobile navigation, journal filters and article return path.
  await page.goto(baseURL + "/");
  await page.getByText("Menu", { exact: true }).click();
  await page.getByRole("navigation", { name: "Mobile primary" }).getByRole("link", { name: "Journal", exact: true }).click();
  await page.waitForURL(baseURL + "/blog/");
  assert.equal(await status(page).textContent(), `${blogPosts.length} posts`);
  await page.getByRole("button", { name: "Case studies", exact: true }).click();
  assert.ok(page.url().includes("topic=Case+studies") || page.url().includes("topic=Case%20studies"));
  assert.equal(await status(page).textContent(), "6 posts");
  await page.reload();
  assert.equal(await page.getByRole("button", { name: "Case studies", exact: true }).getAttribute("aria-pressed"), "true");
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.getByRole("link", { name: "AI without the jargon: a practical starting point", exact: true }).click();
  await page.waitForURL(baseURL + "/blog/ai-without-the-jargon/");
  await page.getByRole("navigation", { name: "In this article" }).getByRole("link", { name: "Privacy settings: four different questions" }).press("Enter");
  assert.ok(page.url().endsWith("#privacy-settings"));
  await page.getByRole("link", { name: "Back to all posts", exact: true }).click();
  await page.waitForURL(baseURL + "/blog/");
  console.log("Journal navigation, topic filters, URL persistence, article contents and return path passed");

  // Desktop navigation, header contact and keyboard focus on the service link.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(baseURL + "/work/");
  await page.getByRole("navigation", { name: "Primary", exact: true }).getByRole("link", { name: "Journal", exact: true }).press("Enter");
  await page.waitForURL(baseURL + "/blog/");
  await page.getByRole("banner").getByRole("link", { name: "Contact", exact: true }).click();
  await page.waitForURL(baseURL + "/#contact");
  const requestLink = page.getByRole("link", { name: "Request a service", exact: true });
  assert.equal(await requestLink.isVisible(), true);
  await requestLink.focus();
  assert.notEqual(await requestLink.evaluate((el) => getComputedStyle(el).outlineStyle), "none");
  let destinationRequested = false;
  await page.route(serviceRequestURL, async (route) => {
    destinationRequested = route.request().isNavigationRequest();
    await route.fulfill({ contentType: "text/html", body: "<!doctype html><html lang='en'><title>Navigation test</title><h1>Service request destination</h1></html>" });
  });
  await Promise.all([page.waitForURL(serviceRequestURL), requestLink.press("Enter")]);
  assert.equal(destinationRequested, true);
  await page.goBack({ waitUntil: "networkidle" });
  await page.unroute(serviceRequestURL);
  if (process.env.VERIFY_LIVE_SERVICE_DESK === "1") {
    const destination = await page.goto(serviceRequestURL, { waitUntil: "networkidle", timeout: 45000 });
    assert.equal(destination.status(), 200);
    await page.locator("#request-form").waitFor();
    console.log("Live service request destination verified; no request submitted");
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL + "/about/");
  await page.getByText("Menu", { exact: true }).click();
  await page.getByRole("navigation", { name: "Mobile primary" }).getByRole("link", { name: "Services", exact: true }).click();
  await page.waitForURL(baseURL + "/#services");
  assert.equal(await page.locator(".nav-disclosure").getAttribute("open"), null);
  console.log("Header contact, service destination, back navigation and mobile services link passed");

  // Work catalogue: filters, search, URL persistence, empty state and case study links.
  await page.goto(baseURL + "/work/");
  assert.equal(await status(page).textContent(), "21 projects");
  await page.getByRole("button", { name: "Embedded", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search projects" }).fill("Gendio");
  assert.equal(await status(page).textContent(), "1 project");
  await page.getByRole("link", { name: "Gendio Display Controller", exact: true }).click();
  await page.waitForURL(baseURL + "/work/gendio-controller/");
  await page.getByRole("navigation", { name: "More case studies" }).getByRole("link", { name: /Next case study/ }).click();
  await page.waitForURL(baseURL + "/work/waterless-solar-panel-cleaner/");
  assert.equal(await page.getByRole("link", { name: "Read the research paper on Zenodo - Revision 02" }).getAttribute("href"), "https://zenodo.org/records/22865101");
  await page.goto(baseURL + "/work/");
  await page.getByRole("button", { name: "Software", exact: true }).click();
  assert.equal(await status(page).textContent(), "6 projects");
  assert.ok(page.url().includes("category=Software"));
  await page.reload();
  assert.equal(await page.getByRole("button", { name: "Software", exact: true }).getAttribute("aria-pressed"), "true");
  await page.getByRole("searchbox", { name: "Search projects" }).fill("no-such-system");
  await page.getByRole("heading", { name: "No matching projects" }).waitFor();
  await page.getByRole("button", { name: "Show all projects" }).click();
  assert.equal(await status(page).textContent(), "21 projects");
  await page.getByRole("searchbox", { name: "Search projects" }).fill("ataxia");
  assert.equal(await status(page).textContent(), "1 project");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  assert.equal(await status(page).textContent(), "21 projects");
  await page.goto(baseURL + "/work/?q=" + encodeURIComponent("Panelogram Retail Shelf Planner"));
  assert.equal(await status(page).textContent(), "1 project");
  console.log("Catalogue filters, search, URL persistence, empty recovery and case study navigation passed");

  // Theme controls stay in step and persist.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(baseURL + "/");
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  assert.equal(await page.getByLabel("Colour theme").inputValue(), "dark");
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.getByLabel("Colour theme").selectOption("system");
  await page.getByLabel("Colour theme").selectOption("light");
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
  assert.ok(await page.getByRole("button", { name: "Switch to dark theme" }).isVisible());
  console.log("Header toggle and footer appearance control passed");

  // Home page structure follows the agreed information path.
  const order = await page.evaluate(() => ["#hero-title", "#featured-title", ".card-grid.compact", "#experience", "#foundation-title", "#contact", "#project-index"].map((s) => document.querySelector(s)?.getBoundingClientRect().top + scrollY));
  assert.ok(order.every((top, i) => Number.isFinite(top) && (i === 0 || top > order[i - 1])), `home order ${order}`);
  assert.equal(await page.locator("#project-index li").count(), 21);
  assert.equal(await page.locator(".compact-timeline").first().locator("li").count(), 8);
  await page.goto(baseURL + "/about/");
  assert.equal(await page.locator(".timeline > li").count(), 8);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByText("Menu", { exact: true }).click();
  await page.getByText("Menu", { exact: true }).press("Escape");
  assert.equal(await page.locator("details.nav-disclosure").getAttribute("open"), null);
  await page.goto(baseURL);
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").textContent(), "Skip to content");
  await page.locator(":focus").press("Enter");
  assert.ok(page.url().endsWith("#main"));
  await page.goto(baseURL + "/work/ataxia-assessment-device/");
  assert.ok((await page.getByRole("link", { name: "Full-size image ↗", exact: true }).getAttribute("href")).endsWith(".webp"));
  assert.equal((await page.goto(baseURL + "/missing-route/")).status(), 404);
  await page.goto(baseURL + "/work/panelogram/");
  await page.waitForURL(baseURL + "/work/");
  if (pageErrors.length) throw new Error(pageErrors.join("\n"));
  console.log("Home structure, timelines, menu, skip link, full-size media, 404 and legacy redirects passed");
  await context.close();

  // Without JavaScript every project and post is still reachable.
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const plain = await nojs.newPage();
  await plain.goto(baseURL + "/");
  assert.equal(await plain.getByRole("link", { name: "Request a service", exact: true }).getAttribute("href"), serviceRequestURL);
  await plain.goto(baseURL + "/work/");
  assert.equal(await plain.locator("[data-project]").count(), 21);
  await plain.goto(baseURL + "/blog/");
  assert.equal(await plain.locator(".post-feature, .post-card").count(), blogPosts.length);
  await plain.getByRole("link", { name: "AI without the jargon: a practical starting point", exact: true }).click();
  assert.equal(await plain.locator(".blog-routine li").count(), 4);
  await nojs.close();
  console.log("No-JavaScript catalogue and journal passed");
  console.log(`All ${routes.length * 14} route/viewport/theme checks passed`);
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
