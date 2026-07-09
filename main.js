/* Sajeevan Veeriah portfolio. Vanilla JS only: mobile navigation,
   skills tab filter and Domain Atlas search/filter. No external
   requests, no frameworks. Everything degrades to readable static
   HTML when JavaScript is unavailable. */
(function () {
    "use strict";

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

    /* ---- Skills tab filter ---- */
    var skillsTabs = document.querySelector("[data-skills-tabs]");
    var skillsGrid = document.querySelector("[data-skills-grid]");

    if (skillsTabs && skillsGrid) {
        skillsTabs.hidden = false;
        var tabs = Array.prototype.slice.call(skillsTabs.querySelectorAll("[data-tab]"));
        var cards = Array.prototype.slice.call(skillsGrid.querySelectorAll("[data-domain]"));

        skillsTabs.addEventListener("click", function (event) {
            var tab = event.target.closest("[data-tab]");
            if (!tab) return;
            var id = tab.getAttribute("data-tab");
            tabs.forEach(function (t) {
                var active = t === tab;
                t.classList.toggle("is-active", active);
                t.setAttribute("aria-pressed", String(active));
            });
            cards.forEach(function (card) {
                card.hidden = id !== "all" && card.getAttribute("data-domain") !== id;
            });
        });
    }

    /* ---- Domain Atlas search and filters ---- */
    var atlasControls = document.querySelector("[data-atlas-controls]");
    var atlasList = document.querySelector("[data-atlas-list]");
    var atlasStatus = document.querySelector("[data-atlas-status]");

    if (atlasControls && atlasList) {
        atlasControls.hidden = false;

        var searchInput = atlasControls.querySelector("[data-atlas-search]");
        var clusterSelect = atlasControls.querySelector("[data-atlas-cluster]");
        var tierButtons = Array.prototype.slice.call(atlasControls.querySelectorAll("[data-tier]"));
        var domains = Array.prototype.slice.call(atlasList.querySelectorAll(".atlas-domain"));
        var activeTier = "all";

        var tierNames = {
            delivered: "Delivered",
            handson: "Hands-on",
            working: "Working knowledge",
            adjacent: "Adjacent",
            target: "Target"
        };

        domains.forEach(function (domain) {
            domain.searchText = domain.textContent.replace(/\s+/g, " ").toLowerCase();
        });

        function applyAtlasFilters() {
            var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
            var cluster = clusterSelect ? clusterSelect.value : "all";
            var shown = 0;

            domains.forEach(function (domain) {
                var tierOk = activeTier === "all" || domain.getAttribute("data-tier") === activeTier;
                var clusterOk = cluster === "all" || domain.getAttribute("data-cluster") === cluster;
                var textOk = !query || domain.searchText.indexOf(query) !== -1;
                var visible = tierOk && clusterOk && textOk;
                domain.hidden = !visible;
                if (visible) shown += 1;
            });

            if (atlasStatus) {
                var status = "Showing " + shown + " of " + domains.length + " domains";
                if (cluster !== "all") status += " in cluster: " + cluster;
                if (activeTier !== "all") status += " at tier: " + tierNames[activeTier];
                if (query) status += " matching \"" + (searchInput ? searchInput.value.trim() : "") + "\"";
                atlasStatus.textContent = status + ".";
            }
        }

        if (searchInput) searchInput.addEventListener("input", applyAtlasFilters);
        if (clusterSelect) clusterSelect.addEventListener("change", applyAtlasFilters);

        tierButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                activeTier = button.getAttribute("data-tier");
                tierButtons.forEach(function (b) {
                    var active = b === button;
                    b.classList.toggle("is-active", active);
                    b.setAttribute("aria-pressed", String(active));
                });
                applyAtlasFilters();
            });
        });

        applyAtlasFilters();
    }

    /* ---- Open a linked case study when navigated to ---- */
    function openTargetDisclosure() {
        var hash = window.location.hash;
        if (!hash || hash.length < 2) return;
        var target;
        try {
            target = document.getElementById(hash.slice(1));
        } catch (err) {
            return;
        }
        if (target && target.tagName === "DETAILS") target.open = true;
    }

    window.addEventListener("hashchange", openTargetDisclosure);
    openTargetDisclosure();
}());
