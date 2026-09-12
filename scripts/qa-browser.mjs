import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join, normalize, resolve } from "node:path";
import { chromium } from "playwright";
import assert from "node:assert/strict";
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
const browser = await chromium.launch({ headless: true });
const blogRoutes = ["/blog/mqtt-connected-does-not-mean-current/","/blog/ros2-topic-visible-but-no-messages/","/blog/robot-localisation-before-controller-tuning/","/blog/noisy-sensors-hysteresis-and-debounce/","/blog/local-ai-beyond-the-model/","/blog/csv-imports-that-deserve-trust/","/blog/local-first-apps-need-a-restore-path/","/blog/automation-retries-without-duplicate-actions/"];
const routes = [
  ...blogRoutes,
  "/",
  "/work/",
  "/about/",
  "/notes/",
  "/blog/",
  "/blog/ai-without-the-jargon/",
  "/work/autonomous-navigation-rover/",
  "/work/ataxia-assessment-device/",
  "/work/swl-pricing-inventory-control/",
];
const serviceRequestURL = "https://sajeevanveeriah.github.io/saj-service-desk/request/";
const failures = [];
await mkdir("/tmp/portfolio-qa", { recursive: true });
try {
  for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      await context.addInitScript(
        (value) => localStorage.setItem("sv-theme", value),
        theme,
      );
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const route of routes) {
        const response = await page.goto(baseURL + route, {
          waitUntil: "networkidle",
        });
        assert.equal(response.status(), 200);
        await page.evaluate(async () => {
          for (const i of document.images) i.loading = "eager";
          await Promise.all(
            [...document.images].map((i) => i.decode().catch(() => {})),
          );
        });
        if ([390, 1440].includes(width) && theme === "light")
          await page.screenshot({
            path: `/tmp/portfolio-qa/${route.replaceAll("/", "_")}-${width}.png`,
            fullPage: true,
          });
        if(theme === "light" && ((route === "/" && [390,1440].includes(width)) || (width === 1440 && ["/work/","/work/ataxia-assessment-device/"].includes(route)))) {
          console.log("VISUAL_PREVIEW " + JSON.stringify({route,width,image:(await page.screenshot({type:"jpeg",quality:65,fullPage:false})).toString("base64")}));
        }
        if (route.startsWith("/blog/")) {
          assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://sajeevanveeriah.github.io" + route);
          assert.equal(await page.locator('.site-nav a[href="/blog/"]').getAttribute("aria-current"), "page");
          if (route === "/blog/ai-without-the-jargon/") {
            assert.equal(await page.locator(".blog-body table").count(), 2);
            assert.equal(await page.locator(".blog-routine li").count(), 4);
            assert.equal(await page.locator(".blog-sources li").count(), 4);
            assert.equal(await page.locator('meta[property="og:type"]').getAttribute("content"), "article");
            assert.equal(await page.locator(".blog-body").evaluate(el => /[\u2013\u2014]/.test(el.textContent)), false);
            const validAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.every(link => document.getElementById(link.getAttribute("href").slice(1))));
            assert.equal(validAnchors, true);
          }
          if ([390, 1440].includes(width) && theme === "light") {
            console.log("BLOG_VISUAL " + JSON.stringify({route,width,image:(await page.screenshot({type:"jpeg",quality:70,fullPage:false})).toString("base64")}));
          }
        }
        if (blogRoutes.includes(route)) {
          assert.equal(await page.locator(".blog-figure img").count(), 1);
          assert.equal(await page.locator(".blog-sources li").count() >= 2, true);
          assert.equal(await page.locator('meta[property="og:type"]').getAttribute("content"), "article");
          assert.equal(await page.locator(".blog-body").evaluate(el => /[\u2013\u2014]/.test(el.textContent)), false);
          assert.equal(await page.locator('a[href^="#"]').evaluateAll(links => links.every(link => document.getElementById(link.getAttribute("href").slice(1)))), true);
          assert.ok((await readFile(join(root, "sitemap.xml"), "utf8")).includes(route));
          const hero = await page.locator(".blog-figure img").getAttribute("src");
          assert.equal(await page.locator('.blog-figure a').getAttribute("href"), hero);
          assert.equal((await stat(join(root, hero.replace(".svg", ".png")))).size > 0, true);
          const contentsLink = page.getByRole("navigation", { name: "In this article" }).getByRole("link").first();
          const anchor = await contentsLink.getAttribute("href");
          await contentsLink.press("Enter");
          assert.ok(page.url().endsWith(anchor));
        }
        if (route === "/") {
          const services = page.getByRole("region", {
            name: "Need a hand with something technical?",
          });
          assert.equal(await services.count(), 1);
          const requestLink = services.getByRole("link", {
            name: "Request a service", exact: true,
          });
          assert.equal(await requestLink.getAttribute("href"), serviceRequestURL);
          const bounds = await requestLink.boundingBox();
          assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44);
          if ([390, 1440].includes(width)) {
            await services.screenshot({
              path: `/tmp/portfolio-qa/services-${width}-${theme}.png`,
            });
          }
        }
        const result = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          images: [...document.images].every(
            (i) => i.complete && i.naturalWidth > 0,
          ),
          logo:
            document.querySelector(".brand img")?.getBoundingClientRect()
              .width >= 38,
          title: document.querySelectorAll("h1").length,
          theme: document.documentElement.dataset.theme,
          media: [...document.querySelectorAll(".project-media img")].every(
            (i) => getComputedStyle(i).objectFit === "contain",
          ),
        }));
        if (
          result.overflow ||
          !result.images ||
          !result.logo ||
          result.title !== 1 ||
          result.theme !== theme ||
          !result.media
        )
          failures.push({ width, theme, route, result });
        await page.addScriptTag({
          path: require.resolve("axe-core/axe.min.js"),
        });
        const axe = await page.evaluate(async () => {
          const r = await axe.run(document, {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
            },
          });
          return r.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          }));
        });
        if (axe.length) failures.push({ width, theme, route, axe });
      }
      if (errors.length) failures.push({ width, theme, errors });
      await context.close();
    }
    console.log(`Verified ${routes.length} routes at ${width}px in light and dark`);
  }
  if(failures.length) throw new Error(JSON.stringify(failures));
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(baseURL + "/");
  await page.getByText("Menu", { exact: true }).click();
  await page.getByRole("navigation", { name: "Mobile primary" }).getByRole("link", { name: "Blog", exact: true }).click();
  await page.waitForURL(baseURL + "/blog/");
  await page.getByRole("link", { name: "AI without the jargon: a practical starting point", exact: true }).click();
  await page.waitForURL(baseURL + "/blog/ai-without-the-jargon/");
  await page.getByRole("navigation", { name: "In this article" }).getByRole("link", { name: "Privacy settings: four different questions" }).press("Enter");
  assert.ok(page.url().endsWith("#privacy-settings"));
  await page.getByRole("link", { name: "Back to all posts", exact: true }).click();
  await page.waitForURL(baseURL + "/blog/");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(baseURL + "/");
  await page.getByRole("navigation", { name: "Primary", exact: true }).getByRole("link", { name: "Blog", exact: true }).press("Enter");
  await page.waitForURL(baseURL + "/blog/");
  await page.setViewportSize({ width: 390, height: 844 });
  console.log("Blog desktop/mobile navigation, article, keyboard contents and return path passed");
  await page.goto(baseURL + "/about/");
  await page.getByText("Menu", { exact: true }).click();
  await page.getByRole("navigation", { name: "Mobile primary" })
    .getByRole("link", { name: "Services", exact: true }).click();
  await page.waitForURL(baseURL + "/#services");
  assert.equal(await page.locator(".nav-disclosure").getAttribute("open"), null);
  const requestLink = page.getByRole("link", { name: "Request a service", exact: true });
  await page.keyboard.press("Tab");
  await requestLink.focus();
  assert.equal(await requestLink.evaluate((el) => el === document.activeElement), true);
  assert.notEqual(await requestLink.evaluate((el) => getComputedStyle(el).outlineStyle), "none");
  let destinationRequested = false;
  await page.route(serviceRequestURL, async (route) => {
    destinationRequested = route.request().isNavigationRequest();
    await route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html lang='en'><title>Navigation test</title><h1>Service request destination</h1></html>",
    });
  });
  await Promise.all([
    page.waitForURL(serviceRequestURL),
    requestLink.press("Enter"),
  ]);
  assert.equal(destinationRequested, true);
  await page.goBack({ waitUntil: "networkidle" });
  assert.equal(await page.locator("#services").count(), 1);
  await page.unroute(serviceRequestURL);
  // Explicit integration check; normal portfolio QA must not depend on another deployment.
  if (process.env.VERIFY_LIVE_SERVICE_DESK === "1") {
    const destination = await page.goto(serviceRequestURL, {
      waitUntil: "networkidle", timeout: 45000,
    });
    assert.equal(destination.status(), 200);
    assert.equal(page.url(), serviceRequestURL);
    await page.locator("#request-form").waitFor();
    assert.ok((await page.title()).includes("Saj Service Desk"));
    console.log("Live service request destination: HTTP 200, exact URL and request form verified; no request submitted");
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(baseURL + "/work/");
  await page.getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Services", exact: true }).click();
  await page.waitForURL(baseURL + "/#services");
  assert.equal(await requestLink.isVisible(), true);
  await page.setViewportSize({ width: 720, height: 500 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.setViewportSize({ width: 390, height: 844 });
  console.log("Service section, desktop/mobile navigation, keyboard destination request, back navigation and reflow passed");
  await page.goto(baseURL + "/work/");
  await page.getByRole("button", { name: "Software", exact: true }).click();
  assert.equal(await page.getByRole("status").textContent(), "7 projects");
  assert.ok(page.url().includes("category=Software"));
  await page.reload();
  assert.equal(
    await page
      .getByRole("button", { name: "Software", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.getByRole("searchbox").fill("no-such-system");
  await page.getByRole("heading", { name: "No matching projects" }).waitFor();
  await page.getByRole("button", { name: "Show all projects" }).click();
  assert.equal(await page.getByRole("status").textContent(), "19 projects");
  await page.getByRole("searchbox").fill("ataxia");
  assert.equal(await page.getByRole("status").textContent(), "1 project");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.getByLabel("Colour theme").selectOption("dark");
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.getByLabel("Colour theme").selectOption("system");
  await page.getByLabel("Colour theme").selectOption("light");
  await page.getByText("Menu", { exact: true }).click();
  assert.equal(
    await page.getByRole("navigation", { name: "Mobile primary" }).isVisible(),
    true,
  );
  await page
    .getByRole("navigation", { name: "Mobile primary" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await page.waitForURL(url => /^\/about\/?$/.test(url.pathname));
  await page.getByRole("heading", {name:"Career timeline",exact:true}).waitFor();
  assert.equal(await page.locator(".timeline li").count(), 7);
  await page.getByText("Menu", { exact: true }).click();
  await page.getByText("Menu", { exact: true }).press("Escape");
  assert.equal(await page.locator("details").getAttribute("open"), null);
  await page.goto(baseURL);
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").textContent(), "Skip to content");
  await page.locator(":focus").press("Enter");
  assert.ok(page.url().endsWith("#main"));
  await page.setViewportSize({ width: 720, height: 900 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.goto(baseURL + "/work/ataxia-assessment-device/");
  const imageHref = await page
    .getByRole("link", { name: "Full-size image ↗", exact: true })
    .getAttribute("href");
  assert.ok(imageHref.endsWith(".webp"));
  const missing = await page.goto(baseURL + "/missing-route/");
  assert.equal(missing.status(), 404);
  await page.goto(baseURL + "/work/panelogram/");
  await page.waitForURL(baseURL + "/work/");
  await context.close();
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const plain = await nojs.newPage();
  await plain.goto(baseURL + "/");
  assert.equal(await plain.getByRole("link", { name: "Request a service", exact: true }).getAttribute("href"), serviceRequestURL);
  await plain.goto(baseURL + "/work/");
  assert.equal(await plain.locator(".catalogue article").count(), 19);
  await plain.goto(baseURL + "/blog/");
  await plain.getByRole("link", { name: "AI without the jargon: a practical starting point", exact: true }).click();
  assert.equal(await plain.locator(".blog-routine li").count(), 4);
  assert.equal(await plain.locator(".blog-body table").count(), 2);
  assert.ok((await readFile(join(root, "sitemap.xml"), "utf8")).includes("/blog/ai-without-the-jargon/"));
  await nojs.close();
  console.log(
    "Filters, URL persistence, search, empty recovery, theme, mobile menu, keyboard, reflow, full-size media, redirects and no-JS passed",
  );
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  } else console.log(`All ${routes.length * 14} route/viewport/theme checks passed`);
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
