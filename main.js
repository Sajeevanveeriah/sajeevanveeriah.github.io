/* Sajeevan Veeriah portfolio. Vanilla JS only: three-state theme
   controller (Auto, Light, Dark), mobile navigation, work filter,
   capability explorer search and filters, engineering system map
   behaviour, active-section navigation and hash deep links.
   No external requests, no frameworks. Everything degrades to
   readable static HTML when JavaScript is unavailable. */
(function () {
    "use strict";

    var root = document.documentElement;
    var body = document.body;

    /* ---- Theme controller ----
       Auto (default): follow the operating system, store nothing.
       Light / Dark: manual override stored in localStorage.
       The inline head script has already applied any stored
       override before first paint. */
    var THEME_KEY = "theme";
    var THEME_COLORS = { dark: "#121110", light: "#F4F2ED" };
    var lightQuery = window.matchMedia("(prefers-color-scheme: light)");
    var themeRadios = Array.prototype.slice.call(document.querySelectorAll("[data-theme-radio]"));

    function storedTheme() {
        try {
            var t = localStorage.getItem(THEME_KEY);
            return (t === "light" || t === "dark") ? t : null;
        } catch (err) {
            return null;
        }
    }

    function resolvedTheme() {
        var manual = root.getAttribute("data-theme");
        if (manual === "light" || manual === "dark") return manual;
        return lightQuery.matches ? "light" : "dark";
    }

    function syncThemeColorMeta() {
        var active = resolvedTheme();
        var manual = root.hasAttribute("data-theme");
        var metas = document.querySelectorAll('meta[name="theme-color"]');
        Array.prototype.forEach.call(metas, function (meta) {
            if (manual) {
                meta.setAttribute("content", THEME_COLORS[active]);
            } else {
                var media = meta.getAttribute("media") || "";
                meta.setAttribute("content",
                    media.indexOf("light") !== -1 ? THEME_COLORS.light : THEME_COLORS.dark);
            }
        });
    }

    function applyTheme(choice) {
        if (choice === "light" || choice === "dark") {
            root.setAttribute("data-theme", choice);
            try { localStorage.setItem(THEME_KEY, choice); } catch (err) { /* ignore */ }
        } else {
            root.removeAttribute("data-theme");
            try { localStorage.removeItem(THEME_KEY); } catch (err) { /* ignore */ }
        }
        syncThemeColorMeta();
    }

    if (themeRadios.length) {
        var initial = storedTheme() || "auto";
        themeRadios.forEach(function (radio) {
            radio.checked = radio.value === initial;
            radio.addEventListener("change", function () {
                if (radio.checked) applyTheme(radio.value);
            });
        });

        var onSchemeChange = function () {
            /* While in Auto the CSS media query re-themes the page;
               only the theme-color meta needs a nudge. */
            syncThemeColorMeta();
        };
        if (typeof lightQuery.addEventListener === "function") {
            lightQuery.addEventListener("change", onSchemeChange);
        } else if (typeof lightQuery.addListener === "function") {
            lightQuery.addListener(onSchemeChange);
        }
        syncThemeColorMeta();
    }

    /* Enable colour transitions only after first paint so the
       initial theme never animates in. */
    window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
            root.classList.add("theme-anim");
        });
    });

    /* ---- Mobile navigation ---- */
    var navToggle = document.querySelector("[data-nav-toggle]");
    var siteNav = document.querySelector("[data-site-nav]");

    function setNavOpen(open) {
        body.classList.toggle("nav-open", open);
        if (navToggle) {
            navToggle.setAttribute("aria-expanded", String(open));
            navToggle.textContent = open ? "Close" : "Menu";
        }
    }

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", function () {
            setNavOpen(!body.classList.contains("nav-open"));
        });
        siteNav.addEventListener("click", function (event) {
            if (event.target.closest("a")) setNavOpen(false);
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && body.classList.contains("nav-open")) {
                setNavOpen(false);
                navToggle.focus();
            }
        });
    }

    /* ---- Active-section navigation ---- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link]"));
    if (navLinks.length && "IntersectionObserver" in window) {
        var linkByTarget = {};
        navLinks.forEach(function (link) {
            var id = (link.getAttribute("href") || "").slice(1);
            if (id) linkByTarget[id] = link;
        });

        var setActive = function (id) {
            navLinks.forEach(function (link) {
                var active = link === linkByTarget[id];
                link.classList.toggle("is-active", active);
                if (active) {
                    link.setAttribute("aria-current", "true");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        };

        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: "-35% 0px -55% 0px" });

        Object.keys(linkByTarget).forEach(function (id) {
            var section = document.getElementById(id);
            if (section) sectionObserver.observe(section);
        });
    }

    /* ---- Selected work filter ---- */
    var workFilters = document.querySelector("[data-work-filters]");
    var workStatus = document.querySelector("[data-work-status]");
    var projects = Array.prototype.slice.call(document.querySelectorAll("[data-project]"));

    if (workFilters && projects.length) {
        workFilters.hidden = false;
        var workButtons = Array.prototype.slice.call(workFilters.querySelectorAll("[data-work-filter]"));

        var applyWorkFilter = function (key, label) {
            var shown = 0;
            projects.forEach(function (card) {
                var domains = (card.getAttribute("data-domains") || "").split(/\s+/);
                var visible = key === "all" || domains.indexOf(key) !== -1;
                card.hidden = !visible;
                if (visible) shown += 1;
            });
            if (workStatus) {
                workStatus.textContent = key === "all"
                    ? "Showing all " + projects.length + " projects."
                    : "Showing " + shown + " of " + projects.length + " projects in " + label + ".";
            }
        };

        workButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                workButtons.forEach(function (b) {
                    var active = b === button;
                    b.classList.toggle("is-active", active);
                    b.setAttribute("aria-pressed", String(active));
                });
                applyWorkFilter(button.getAttribute("data-work-filter"), button.textContent.trim());
            });
        });
    }

    /* ---- Capability explorer: search and filters ---- */
    var capControls = document.querySelector("[data-cap-controls]");
    var capList = document.querySelector("[data-cap-list]");
    var capStatus = document.querySelector("[data-cap-status]");
    var capClusterSelect = null;

    if (capControls && capList) {
        capControls.hidden = false;

        var capSearch = capControls.querySelector("[data-cap-search]");
        capClusterSelect = capControls.querySelector("[data-cap-cluster]");
        var tierButtons = Array.prototype.slice.call(capControls.querySelectorAll("[data-cap-tier]"));
        var contextButtons = Array.prototype.slice.call(capControls.querySelectorAll("[data-cap-context]"));
        var entries = Array.prototype.slice.call(capList.querySelectorAll(".cap-entry"));
        var activeTier = "all";
        var activeContext = "all";

        var tierNames = {
            delivered: "Delivered",
            handson: "Hands-on",
            working: "Working knowledge",
            adjacent: "Adjacent",
            target: "Target"
        };

        entries.forEach(function (entry) {
            entry.searchText = entry.textContent.replace(/\s+/g, " ").toLowerCase();
        });

        var applyCapFilters = function () {
            var query = capSearch ? capSearch.value.trim().toLowerCase() : "";
            var cluster = capClusterSelect ? capClusterSelect.value : "all";
            var shown = 0;

            entries.forEach(function (entry) {
                var contexts = (entry.getAttribute("data-context") || "").split(/\s+/);
                var tierOk = activeTier === "all" || entry.getAttribute("data-tier") === activeTier;
                var clusterOk = cluster === "all" || entry.getAttribute("data-cluster") === cluster;
                var contextOk = activeContext === "all" || contexts.indexOf(activeContext) !== -1;
                var textOk = !query || entry.searchText.indexOf(query) !== -1;
                var visible = tierOk && clusterOk && contextOk && textOk;
                entry.hidden = !visible;
                if (visible) shown += 1;
            });

            if (capStatus) {
                var status = "Showing " + shown + " of " + entries.length + " capability domains";
                if (activeTier !== "all") status += " at tier: " + tierNames[activeTier];
                if (activeContext !== "all") status += " with context filter applied";
                if (query) status += " matching \"" + (capSearch ? capSearch.value.trim() : "") + "\"";
                capStatus.textContent = status + ".";
            }
        };

        if (capSearch) capSearch.addEventListener("input", applyCapFilters);
        if (capClusterSelect) capClusterSelect.addEventListener("change", applyCapFilters);

        var wireButtonGroup = function (buttons, setValue) {
            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    setValue(button);
                    buttons.forEach(function (b) {
                        var active = b === button;
                        b.classList.toggle("is-active", active);
                        b.setAttribute("aria-pressed", String(active));
                    });
                    applyCapFilters();
                });
            });
        };

        wireButtonGroup(tierButtons, function (button) {
            activeTier = button.getAttribute("data-cap-tier");
        });
        wireButtonGroup(contextButtons, function (button) {
            activeContext = button.getAttribute("data-cap-context");
        });

        applyCapFilters();

        /* Expose for the system map */
        capList.applyCapFilters = applyCapFilters;
    }

    /* ---- Engineering system map ---- */
    var systemMap = document.querySelector("[data-system-map]");
    if (systemMap) {
        var engage = function (on) {
            systemMap.classList.toggle("map-engaged", on);
        };
        systemMap.addEventListener("mouseover", function (event) {
            engage(Boolean(event.target.closest(".map-layer-link")));
        });
        systemMap.addEventListener("mouseleave", function () { engage(false); });
        systemMap.addEventListener("focusin", function (event) {
            engage(Boolean(event.target.closest(".map-layer-link")));
        });
        systemMap.addEventListener("focusout", function () { engage(false); });

        /* Selecting a layer pre-filters the capability explorer,
           then follows the anchor to it. */
        systemMap.addEventListener("click", function (event) {
            var link = event.target.closest("[data-map-cluster]");
            if (!link || !capClusterSelect) return;
            capClusterSelect.value = link.getAttribute("data-map-cluster");
            if (capList && typeof capList.applyCapFilters === "function") {
                capList.applyCapFilters();
            }
        });
    }

    /* ---- Open a linked disclosure when navigated to ---- */
    function openTargetDisclosure() {
        var hash = window.location.hash;
        if (!hash || hash.length < 2) return;
        var target;
        try {
            target = document.getElementById(decodeURIComponent(hash.slice(1)));
        } catch (err) {
            return;
        }
        if (!target) return;
        if (target.tagName === "DETAILS") {
            target.open = true;
        }
        var parentDetails = target.closest("details");
        if (parentDetails) parentDetails.open = true;
    }

    window.addEventListener("hashchange", openTargetDisclosure);
    openTargetDisclosure();
}());
