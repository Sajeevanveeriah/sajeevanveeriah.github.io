/* Sajeevan Veeriah portfolio. Vanilla JS only: mobile navigation,
   active-section navigation, work filter, Engineering Atlas search
   and filters, Systems Stack to Atlas pre-filtering, hash deep links
   and cinematic motion-safe interaction. No external requests, no
   frameworks. Everything degrades to readable static HTML when
   JavaScript is unavailable. */
(function () {
    "use strict";

    var root = document.documentElement;
    var body = document.body;

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

    /* ---- Work filter ---- */
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
                    ? "Showing all " + projects.length + " work records."
                    : "Showing " + shown + " of " + projects.length + " work records in " + label + ".";
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

    /* ---- Engineering Atlas: search and filters ---- */
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
                var status = "Showing " + shown + " of " + entries.length + " atlas domains";
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

        /* Expose for the Systems Stack pre-filter */
        capList.applyCapFilters = applyCapFilters;
    }

    /* ---- Systems Stack: selecting a layer pre-filters the Atlas ---- */
    var stack = document.querySelector("[data-stack]");
    if (stack) {
        stack.addEventListener("click", function (event) {
            var link = event.target.closest("[data-stack-cluster]");
            if (!link || !capClusterSelect) return;
            capClusterSelect.value = link.getAttribute("data-stack-cluster");
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

    /* ---- Cinematic, motion-safe interaction system ----
       All movement is driven by load, scroll or direct pointer input.
       Nothing loops continuously, content is never hidden without
       JavaScript and reduced-motion users receive the static site. */
    var motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motionOk) {
        root.classList.add("motion-ready");

        var progressRail = document.createElement("div");
        progressRail.className = "scroll-progress";
        progressRail.setAttribute("aria-hidden", "true");
        body.appendChild(progressRail);

        var hero = document.querySelector(".hero");
        var signalPanel = document.querySelector("[data-signal-panel]");
        var mediaItems = Array.prototype.slice.call(document.querySelectorAll(
            ".project-media img, .project-featured-media img"
        ));
        var previousScroll = window.scrollY;
        var motionTicking = false;
        var header = document.querySelector(".site-header");

        var clamp = function (value, min, max) {
            return Math.min(max, Math.max(min, value));
        };

        var updateScrollMotion = function () {
            var scrollY = window.scrollY;
            var maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
            var pageProgress = clamp(scrollY / maxScroll, 0, 1);
            root.style.setProperty("--scroll-progress", pageProgress.toFixed(4));

            if (hero) {
                var heroHeight = Math.max(1, hero.offsetHeight);
                var heroProgress = clamp(scrollY / heroHeight, 0, 1);
                hero.style.setProperty("--grid-shift", (heroProgress * 34).toFixed(1) + "px");
                hero.style.setProperty("--hero-copy-shift", (heroProgress * 74).toFixed(1) + "px");
                hero.style.setProperty("--hero-copy-opacity", (1 - heroProgress * 0.72).toFixed(3));
                hero.style.setProperty("--signal-shift", (heroProgress * -46).toFixed(1) + "px");
                hero.style.setProperty("--hero-aura", (0.82 - heroProgress * 0.5).toFixed(3));
            }

            mediaItems.forEach(function (image) {
                var rect = image.getBoundingClientRect();
                if (rect.bottom > -100 && rect.top < window.innerHeight + 100) {
                    var centreDelta = (rect.top + rect.height / 2) - window.innerHeight / 2;
                    var mediaShift = clamp(centreDelta / window.innerHeight, -1, 1) * -18;
                    image.style.setProperty("--media-shift", mediaShift.toFixed(1) + "px");
                }
            });

            if (header) {
                var travellingDown = scrollY > previousScroll;
                header.classList.toggle("is-hidden", travellingDown && scrollY > 180);
            }
            previousScroll = scrollY;
            motionTicking = false;
        };

        var requestMotionUpdate = function () {
            if (motionTicking) return;
            motionTicking = true;
            window.requestAnimationFrame(updateScrollMotion);
        };

        window.addEventListener("scroll", requestMotionUpdate, { passive: true });
        window.addEventListener("resize", requestMotionUpdate);
        updateScrollMotion();

        if (hero) {
            hero.addEventListener("pointermove", function (event) {
                var rect = hero.getBoundingClientRect();
                var x = clamp((event.clientX - rect.left) / rect.width, 0, 1) * 100;
                var y = clamp((event.clientY - rect.top) / rect.height, 0, 1) * 100;
                hero.style.setProperty("--spot-x", x.toFixed(1) + "%");
                hero.style.setProperty("--spot-y", y.toFixed(1) + "%");
            });
        }

        if (signalPanel && window.matchMedia("(pointer: fine)").matches) {
            signalPanel.addEventListener("pointermove", function (event) {
                var rect = signalPanel.getBoundingClientRect();
                var x = clamp((event.clientX - rect.left) / rect.width, 0, 1) - 0.5;
                var y = clamp((event.clientY - rect.top) / rect.height, 0, 1) - 0.5;
                signalPanel.style.setProperty("--signal-tilt-x", (-y * 5).toFixed(2) + "deg");
                signalPanel.style.setProperty("--signal-tilt-y", (x * 6).toFixed(2) + "deg");
            });
            signalPanel.addEventListener("pointerleave", function () {
                signalPanel.style.setProperty("--signal-tilt-x", "0deg");
                signalPanel.style.setProperty("--signal-tilt-y", "0deg");
            });
        }

        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                root.classList.add("motion-loaded");
            });
        });
    }

    if (motionOk && "IntersectionObserver" in window) {
        var revealTargets = Array.prototype.slice.call(document.querySelectorAll(
            ".section-heading, .project-featured, .project-card, .tool-group, " +
            ".role-card, .creds-card, .beyond-card, .stack-layer, .contact-panel-wrap"
        ));
        if (revealTargets.length) {
            root.classList.add("reveal-armed");
            var revealObserver = new IntersectionObserver(function (obsEntries) {
                obsEntries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-in");
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: "0px 0px -7% 0px", threshold: 0.06 });

            revealTargets.forEach(function (el, index) {
                el.classList.add("reveal");
                el.style.setProperty("--reveal-delay", String((index % 3) * 70) + "ms");
                revealObserver.observe(el);
            });
        }
    }
}());
