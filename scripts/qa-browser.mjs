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
const routes = [
  "/",
  "/work/",
  "/about/",
  "/notes/",
  "/work/autonomous-navigation-rover/",
  "/work/ataxia-assessment-device/",
  "/work/swl-pricing-inventory-control/",
];
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
    console.log(`Verified seven routes at ${width}px in light and dark`);
  }
  if(failures.length) throw new Error(JSON.stringify(failures));
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
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
    .getByRole("link", { name: "Full-size image", exact: false })
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
  await plain.goto(baseURL + "/work/");
  assert.equal(await plain.locator(".catalogue article").count(), 19);
  await nojs.close();
  console.log(
    "Filters, URL persistence, search, empty recovery, theme, mobile menu, keyboard, reflow, full-size media, redirects and no-JS passed",
  );
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  } else console.log("All 98 route/viewport/theme checks passed");
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
