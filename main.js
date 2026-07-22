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

    /* Shared reduced-motion signal. Every enhancement checks this so a
       reduced-motion user receives an immediate, complete static site. */
    var reduceMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    var motionOk = !reduceMotionMq.matches;

    /* Re-run a short entry animation on an element, safely restarting it
       for rapid successive calls. No-op under reduced motion. */
    function playFilterEnter(el) {
        if (!motionOk) return;
        el.classList.remove("filter-enter");
        void el.offsetWidth;
        el.classList.add("filter-enter");
        var settle = function () {
            el.classList.remove("filter-enter");
            el.removeEventListener("animationend", settle);
            el.removeEventListener("animationcancel", settle);
        };
        el.addEventListener("animationend", settle);
        el.addEventListener("animationcancel", settle);
    }

    /* Run an optional enhancement in isolation. If it throws, the
       failure handler restores a fully visible static page and later
       independent features still initialise. */
    function safeInit(init, onFail) {
        try {
            init();
        } catch (err) {
            if (onFail) {
                try { onFail(); } catch (ignore) { /* fail open silently */ }
            }
        }
    }

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
                var wasHidden = card.hidden;
                card.hidden = !visible;
                if (visible) {
                    shown += 1;
                    if (wasHidden) playFilterEnter(card);
                } else {
                    card.classList.remove("filter-enter");
                }
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
                var wasHidden = entry.hidden;
                entry.hidden = !visible;
                if (visible) {
                    shown += 1;
                    if (wasHidden) playFilterEnter(entry);
                } else {
                    entry.classList.remove("filter-enter");
                }
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
    var stackLayers = Array.prototype.slice.call(
        document.querySelectorAll(".stack-layer")
    );

    function clearStackActive() {
        stackLayers.forEach(function (layer) {
            layer.classList.remove("is-active");
        });
    }

    function flashAtlasRegion() {
        if (!motionOk || !capList) return;
        capList.classList.remove("is-region-flash");
        void capList.offsetWidth;
        capList.classList.add("is-region-flash");
        capList.addEventListener("animationend", function handler() {
            capList.classList.remove("is-region-flash");
            capList.removeEventListener("animationend", handler);
        });
    }

    if (stack) {
        stack.addEventListener("click", function (event) {
            var link = event.target.closest("[data-stack-cluster]");
            if (!link || !capClusterSelect) return;
            capClusterSelect.value = link.getAttribute("data-stack-cluster");
            if (capList && typeof capList.applyCapFilters === "function") {
                capList.applyCapFilters();
            }
            clearStackActive();
            var layer = link.closest(".stack-layer");
            if (layer) layer.classList.add("is-active");
            /* The anchor scrolls to #atlas natively; flash the region once
               it has arrived. Skipped entirely under reduced motion. */
            if (motionOk) {
                window.setTimeout(flashAtlasRegion, 520);
            }
        });
    }

    /* If the Atlas domain is changed directly, the Stack highlight no
       longer reflects the filter, so clear it. */
    if (capClusterSelect) {
        capClusterSelect.addEventListener("change", clearStackActive);
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

    /* ---- B. Native disclosure open and close transitions ----
       Progressive enhancement only. Native <details>/<summary> semantics
       are preserved: we intercept the toggle, drive the inner content
       height with the Web Animations API, and always clear the inline
       height afterwards so no stale fixed height is left. Deep links and
       reduced-motion users open and close instantly through the native
       control. Easings mirror --ease-settle and --ease-exit. */
    if (motionOk && typeof Element.prototype.animate === "function") {
        safeInit(function () {
            var OPEN_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
            var CLOSE_EASE = "cubic-bezier(0.4, 0, 1, 1)";
            var disclosures = Array.prototype.slice.call(
                document.querySelectorAll(".case-study, .cap-entry, .role-detail")
            );

            disclosures.forEach(function (details) {
                var summary = details.querySelector("summary");
                if (!summary) return;
                var content = summary.nextElementSibling;
                if (!content) return;
                var current = null;
                var closing = false;

                /* Only the animation that still owns the disclosure may
                   clear the inline styles: a cancelled run must not wipe
                   the state of the run that interrupted it. */
                var resetFor = function (anim) {
                    return function () {
                        if (current !== anim) return;
                        content.style.overflow = "";
                        content.style.height = "";
                        current = null;
                    };
                };

                summary.addEventListener("click", function (event) {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                        return;
                    }
                    event.preventDefault();

                    var wasOpen = details.open;
                    try {
                        var startHeight = content.getBoundingClientRect().height;
                        if (current) {
                            var stale = current;
                            current = null;
                            stale.cancel();
                        }
                        content.style.overflow = "hidden";

                        if (!details.open || closing) {
                            closing = false;
                            if (!details.open) details.open = true;
                            var target = content.scrollHeight;
                            current = content.animate(
                                [
                                    { height: startHeight + "px", opacity: startHeight ? 1 : 0 },
                                    { height: target + "px", opacity: 1 }
                                ],
                                { duration: 300, easing: OPEN_EASE }
                            );
                            current.onfinish = resetFor(current);
                            current.oncancel = resetFor(current);
                        } else {
                            closing = true;
                            current = content.animate(
                                [
                                    { height: startHeight + "px", opacity: 1 },
                                    { height: "0px", opacity: 0 }
                                ],
                                { duration: 260, easing: CLOSE_EASE }
                            );
                            var closeReset = resetFor(current);
                            current.onfinish = function () {
                                details.open = false;
                                closing = false;
                                closeReset();
                            };
                            current.oncancel = closeReset;
                        }
                    } catch (err) {
                        /* Fail open to the native toggle so a runtime error
                           can never leave disclosure content stuck. */
                        content.style.overflow = "";
                        content.style.height = "";
                        closing = false;
                        current = null;
                        details.open = !wasOpen;
                    }
                });
            });
        });
    }

    /* ---- A. Closed-loop signal panel path ----
       Hovering (fine pointer) or keyboard-focusing a node progressively
       lights the engineering path up to that node and marks it engaged.
       Reaching Verify emphasises the return/feedback path. The gold fill
       line transitions under motion and snaps immediately under reduced
       motion. The underlying ordered list stays valid and readable with
       no JavaScript; state is purely additive. */
    safeInit(function initSignalPath() {
        var panel = document.querySelector("[data-signal-panel]");
        if (!panel) return;
        var flow = panel.querySelector(".signal-flow");
        if (!flow) return;
        var nodes = Array.prototype.slice.call(flow.querySelectorAll(".signal-node"));
        if (nodes.length < 2) return;
        var last = nodes.length - 1;
        var finePointer = window.matchMedia("(pointer: fine)").matches;

        var engage = function (index) {
            flow.style.setProperty("--signal-reach", (index / last).toFixed(3));
            nodes.forEach(function (node, i) {
                node.classList.toggle("is-lit", i <= index);
                node.classList.toggle("is-engaged", i === index);
            });
            panel.classList.toggle("is-loop-complete", index === last);
        };

        var clearPath = function () {
            flow.style.setProperty("--signal-reach", "0");
            nodes.forEach(function (node) {
                node.classList.remove("is-lit");
                node.classList.remove("is-engaged");
            });
            panel.classList.remove("is-loop-complete");
        };

        nodes.forEach(function (node, i) {
            node.setAttribute("tabindex", "0");
            node.addEventListener("focus", function () { engage(i); });
            if (finePointer) {
                node.addEventListener("pointerenter", function () { engage(i); });
            }
        });

        flow.addEventListener("focusout", function (event) {
            if (!flow.contains(event.relatedTarget)) clearPath();
        });
        if (finePointer) {
            flow.addEventListener("pointerleave", clearPath);
        }
    });

    /* ---- Cinematic, motion-safe interaction system ----
       All movement is driven by load, scroll or direct pointer input.
       Nothing loops continuously, content is never hidden without
       JavaScript and reduced-motion users receive the static site. */
    if (motionOk) {
        safeInit(function () {
            root.classList.add("motion-ready");

            var progressRail = document.createElement("div");
            progressRail.className = "scroll-progress";
            progressRail.setAttribute("aria-hidden", "true");
            body.appendChild(progressRail);

            var hero = document.querySelector(".hero");
            var signalPanel = document.querySelector("[data-signal-panel]");
            /* Where the browser drives the media parallax natively with a
               view() timeline (styles.css), the JS parallax stands down so
               the scroll handler never touches the images at all. */
            var supportsViewTimeline = !!(window.CSS && CSS.supports &&
                CSS.supports("animation-timeline", "view()"));
            var mediaItems = supportsViewTimeline ? [] : Array.prototype.slice.call(
                document.querySelectorAll(".project-media img, .project-featured-media img")
            );

            /* Only media currently in or near the viewport is parallaxed, so the
               scroll handler measures a small active set rather than every image
               on every frame. will-change is toggled with the same lifecycle. */
            var activeMedia = mediaItems;
            if ("IntersectionObserver" in window) {
                activeMedia = [];
                var mediaObserver = new IntersectionObserver(function (obs) {
                    obs.forEach(function (obsEntry) {
                        var img = obsEntry.target;
                        var pos = activeMedia.indexOf(img);
                        if (obsEntry.isIntersecting) {
                            if (pos === -1) activeMedia.push(img);
                            img.classList.add("is-parallaxing");
                        } else {
                            if (pos !== -1) activeMedia.splice(pos, 1);
                            img.classList.remove("is-parallaxing");
                        }
                    });
                }, { rootMargin: "200px 0px 200px 0px" });
                mediaItems.forEach(function (img) { mediaObserver.observe(img); });
            }

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

                activeMedia.forEach(function (image) {
                    var rect = image.getBoundingClientRect();
                    var centreDelta = (rect.top + rect.height / 2) - window.innerHeight / 2;
                    var mediaShift = clamp(centreDelta / window.innerHeight, -1, 1) * -18;
                    image.style.setProperty("--media-shift", mediaShift.toFixed(1) + "px");
                });

                if (header) {
                    var travellingDown = scrollY > previousScroll;
                    var focusInHeader = header.contains(document.activeElement);
                    header.classList.toggle(
                        "is-hidden",
                        travellingDown && scrollY > 180 && !focusInHeader && !body.classList.contains("nav-open")
                    );
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

            /* Bounded fail-safe: if the completion class has not
               arrived promptly (a stalled frame or an unexpected
               error), reveal the hero anyway. Idempotent. */
            window.setTimeout(function () {
                root.classList.add("motion-loaded");
            }, 1500);
        }, function () {
            /* Fail open: never leave the hero in its armed hidden
               entrance state if the motion system cannot run. */
            root.classList.remove("motion-ready");
            root.classList.remove("motion-loaded");
        });
    }

    if (motionOk && "IntersectionObserver" in window) {
        safeInit(function () {
            var revealTargets = Array.prototype.slice.call(document.querySelectorAll(
                ".section-heading, .project-featured, .project-card, .tool-group, " +
                ".role-card, .creds-card, .beyond-card, .stack-layer, .contact-panel-wrap"
            ));
            if (revealTargets.length) {
                var revealObserver = new IntersectionObserver(function (obsEntries) {
                    obsEntries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("is-in");
                            revealObserver.unobserve(entry.target);
                        }
                    });
                }, { rootMargin: "0px 0px -7% 0px", threshold: 0.06 });

                /* When the page opens part-way down (deep link or restored
                   scroll position), content at or above the entry viewport
                   is shown immediately rather than waiting to animate in. */
                var entryTop = window.scrollY;
                if (window.location.hash.length > 1) {
                    try {
                        var anchor = document.getElementById(
                            decodeURIComponent(window.location.hash.slice(1))
                        );
                        if (anchor) {
                            entryTop = Math.max(
                                entryTop,
                                anchor.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2
                            );
                        }
                    } catch (ignore) { /* malformed hash: keep scroll position */ }
                }

                revealTargets.forEach(function (el, index) {
                    el.classList.add("reveal");
                    el.style.setProperty("--reveal-delay", String((index % 3) * 70) + "ms");
                    var docTop = el.getBoundingClientRect().top + window.scrollY;
                    if (entryTop > 0 && docTop < entryTop + window.innerHeight) {
                        el.classList.add("is-in");
                    } else {
                        revealObserver.observe(el);
                    }
                });

                /* Arm the hidden reveal state only after every target is
                   successfully observed, so content can never be hidden
                   without an observer that will show it again. */
                root.classList.add("reveal-armed");
            }
        }, function () {
            root.classList.remove("reveal-armed");
        });
    }

    /* ---- Colour theme controller ----
       Default is "system": no data-theme attribute, so the
       prefers-color-scheme media queries in styles.css choose the
       palette. The header control cycles system, light then dark and
       stores the choice. A short .theme-transition window eases the
       change; the first application on load is instant so there is no
       entry flicker. The browser chrome colour is kept in sync for all
       three states, including a forced theme that opposes the system. */
    safeInit(function initTheme() {
        var toggle = document.querySelector("[data-theme-toggle]");
        var storageKey = "theme";
        var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

        var stored = null;
        try { stored = localStorage.getItem(storageKey); } catch (e) { /* ignore */ }
        var mode = (stored === "light" || stored === "dark") ? stored : "system";

        var themeColorMeta = null;
        var pair = Array.prototype.slice.call(
            document.querySelectorAll('meta[name="theme-color"][data-theme-color]')
        );
        if (pair.length) {
            pair.forEach(function (m, i) { if (i > 0 && m.parentNode) m.parentNode.removeChild(m); });
            themeColorMeta = pair[0];
            themeColorMeta.removeAttribute("media");
        }

        var colours = { dark: "#0B0D12", light: "#F3F1EB" };
        var labels = {
            system: "Colour theme: follow system",
            light: "Colour theme: light",
            dark: "Colour theme: dark"
        };

        var effective = function () {
            if (mode === "light" || mode === "dark") return mode;
            return systemDark.matches ? "dark" : "light";
        };

        var apply = function (animate) {
            if (mode === "system") {
                root.removeAttribute("data-theme");
            } else {
                root.setAttribute("data-theme", mode);
            }
            if (themeColorMeta) themeColorMeta.setAttribute("content", colours[effective()]);
            if (toggle) {
                toggle.setAttribute("data-mode", mode);
                toggle.setAttribute("aria-label", labels[mode]);
                toggle.setAttribute("title", labels[mode]);
            }
            if (animate && motionOk) {
                root.classList.add("theme-transition");
                window.setTimeout(function () {
                    root.classList.remove("theme-transition");
                }, 480);
            }
        };

        apply(false);

        if (toggle) {
            var order = ["system", "light", "dark"];
            toggle.addEventListener("click", function () {
                mode = order[(order.indexOf(mode) + 1) % order.length];
                try {
                    if (mode === "system") localStorage.removeItem(storageKey);
                    else localStorage.setItem(storageKey, mode);
                } catch (e) { /* ignore */ }
                apply(true);
            });
        }

        var onSystemChange = function () { if (mode === "system") apply(false); };
        if (systemDark.addEventListener) systemDark.addEventListener("change", onSystemChange);
        else if (systemDark.addListener) systemDark.addListener(onSystemChange);
    });

    /* ---- Count-up statistics ----
       Figures ease from zero to their target the first time they enter
       the viewport. Reduced-motion visitors, and anyone without an
       observer, see the final number immediately. */
    safeInit(function initCountUp() {
        var nums = Array.prototype.slice.call(document.querySelectorAll("[data-countup]"));
        if (!nums.length) return;
        if (!motionOk || !("IntersectionObserver" in window)) {
            nums.forEach(function (el) { el.textContent = el.getAttribute("data-countup"); });
            return;
        }
        var run = function (el) {
            var target = parseInt(el.getAttribute("data-countup"), 10) || 0;
            var duration = 1100;
            var start = null;
            var step = function (ts) {
                if (start === null) start = ts;
                var p = Math.min(1, (ts - start) / duration);
                var eased = 1 - Math.pow(1 - p, 3);
                el.textContent = String(Math.round(eased * target));
                if (p < 1) window.requestAnimationFrame(step);
                else el.textContent = String(target);
            };
            window.requestAnimationFrame(step);
        };
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    run(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        nums.forEach(function (el) { obs.observe(el); });
    });

    /* ---- Click-to-copy email ----
       Hidden until enhanced, so no-JS visitors only ever see the working
       mailto link. Uses the async clipboard API with a legacy fallback. */
    safeInit(function initCopyEmail() {
        var btn = document.querySelector("[data-copy-email]");
        if (!btn) return;
        btn.hidden = false;
        var value = btn.getAttribute("data-copy-email") || "";
        var resetTimer = null;
        var mark = function () {
            btn.classList.add("is-copied");
            btn.setAttribute("aria-label", "Email address copied");
            if (resetTimer) window.clearTimeout(resetTimer);
            resetTimer = window.setTimeout(function () {
                btn.classList.remove("is-copied");
                btn.setAttribute("aria-label", "Copy email address to clipboard");
            }, 1800);
        };
        var fallbackCopy = function (text) {
            try {
                var ta = document.createElement("textarea");
                ta.value = text;
                ta.setAttribute("readonly", "");
                ta.style.position = "absolute";
                ta.style.left = "-9999px";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
                return true;
            } catch (e) { return false; }
        };
        btn.addEventListener("click", function () {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(value).then(mark, function () {
                    if (fallbackCopy(value)) mark();
                });
            } else if (fallbackCopy(value)) {
                mark();
            }
        });
    });

    /* ---- Back-to-top control ----
       Works as a plain #top anchor with no JS; the script only reveals it
       past a threshold, so it serves reduced-motion visitors too. */
    safeInit(function initBackToTop() {
        var btn = document.querySelector("[data-to-top]");
        if (!btn) return;
        var shown = false;
        var ticking = false;
        var update = function () {
            var show = window.scrollY > window.innerHeight * 0.9;
            if (show !== shown) {
                shown = show;
                btn.classList.toggle("is-visible", show);
            }
            ticking = false;
        };
        var onScroll = function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
    });

    /* ---- Magnetic controls ----
       While hovering a [data-magnetic] control on a fine pointer, the
       button eases toward the cursor and its label trails a little, then
       both settle back on leave. Purely additive and motion-gated. */
    if (motionOk && window.matchMedia("(pointer: fine)").matches) {
        safeInit(function initMagnetic() {
            var controls = Array.prototype.slice.call(document.querySelectorAll("[data-magnetic]"));
            controls.forEach(function (el) {
                var label = el.querySelector(".mag-label");
                el.addEventListener("pointermove", function (event) {
                    var rect = el.getBoundingClientRect();
                    var mx = (event.clientX - rect.left) / rect.width - 0.5;
                    var my = (event.clientY - rect.top) / rect.height - 0.5;
                    el.style.setProperty("--mag-x", (mx * 12).toFixed(2) + "px");
                    el.style.setProperty("--mag-y", (my * 10).toFixed(2) + "px");
                    if (label) {
                        label.style.setProperty("--mag-lx", (mx * 5).toFixed(2) + "px");
                        label.style.setProperty("--mag-ly", (my * 4).toFixed(2) + "px");
                    }
                });
                el.addEventListener("pointerleave", function () {
                    el.style.setProperty("--mag-x", "0px");
                    el.style.setProperty("--mag-y", "0px");
                    if (label) {
                        label.style.setProperty("--mag-lx", "0px");
                        label.style.setProperty("--mag-ly", "0px");
                    }
                });
            });
        });
    }

    /* ---- Print: expand every disclosure so the printout is complete ---- */
    safeInit(function initPrintExpansion() {
        var opened = [];
        var expand = function () {
            opened = [];
            Array.prototype.slice.call(document.querySelectorAll("details:not([open])")).forEach(function (d) {
                opened.push(d);
                d.open = true;
            });
        };
        var restore = function () {
            opened.forEach(function (d) { d.open = false; });
            opened = [];
        };
        window.addEventListener("beforeprint", expand);
        window.addEventListener("afterprint", restore);
        if (window.matchMedia) {
            var printMq = window.matchMedia("print");
            if (printMq.addEventListener) {
                printMq.addEventListener("change", function (e) {
                    if (e.matches) expand(); else restore();
                });
            }
        }
    });

    /* ---- Hero particle field ----
       A capped constellation of champagne and steel points that drift,
       link to near neighbours and expand away from the pointer, giving
       the hero a living depth. Built only for fine-pointer visitors with
       motion allowed; it pauses whenever the hero leaves the viewport or
       the tab is hidden, caps its density and device pixel ratio, and
       reads its colours from the active theme so it recolours with light
       and dark. */
    if (motionOk) {
        safeInit(function initParticles() {
            var canvas = document.querySelector("[data-hero-particles]");
            if (!canvas) return;
            var hero = document.querySelector(".hero");
            if (!hero) return;
            if (!window.matchMedia("(pointer: fine)").matches) return;
            var ctx = canvas.getContext("2d");
            if (!ctx) return;

            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            var width = 0;
            var height = 0;
            var particles = [];
            var pointer = { x: -9999, y: -9999, active: false };
            var running = false;
            var heroInView = true;
            var rafId = null;
            var colours = {
                a: "rgba(208,178,116,0.75)",
                b: "rgba(143,176,206,0.62)",
                link: "rgba(208,178,116,0.16)"
            };

            var readColours = function () {
                var cs = getComputedStyle(document.documentElement);
                var a = cs.getPropertyValue("--particle-a").trim();
                var b = cs.getPropertyValue("--particle-b").trim();
                var link = cs.getPropertyValue("--particle-link").trim();
                if (a) colours.a = a;
                if (b) colours.b = b;
                if (link) colours.link = link;
            };

            var build = function () {
                var rect = hero.getBoundingClientRect();
                width = Math.max(1, rect.width);
                height = Math.max(1, rect.height);
                canvas.width = Math.round(width * dpr);
                canvas.height = Math.round(height * dpr);
                canvas.style.width = width + "px";
                canvas.style.height = height + "px";
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                var count = Math.min(72, Math.round((width * height) / 16000));
                particles = [];
                for (var i = 0; i < count; i++) {
                    particles.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        vx: (Math.random() - 0.5) * 0.22,
                        vy: (Math.random() - 0.5) * 0.22,
                        r: Math.random() * 1.6 + 0.8,
                        gold: Math.random() > 0.5
                    });
                }
            };

            var LINK_DIST = 118;
            var POINTER_DIST = 150;

            var frame = function () {
                if (!running) return;
                ctx.clearRect(0, 0, width, height);
                var i, j, p, q;
                for (i = 0; i < particles.length; i++) {
                    p = particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > width) p.vx *= -1;
                    if (p.y < 0 || p.y > height) p.vy *= -1;
                    if (pointer.active) {
                        var dx = p.x - pointer.x;
                        var dy = p.y - pointer.y;
                        var d = Math.sqrt(dx * dx + dy * dy);
                        if (d < POINTER_DIST && d > 0.01) {
                            var force = (POINTER_DIST - d) / POINTER_DIST * 0.9;
                            p.x += (dx / d) * force;
                            p.y += (dy / d) * force;
                        }
                    }
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = p.gold ? colours.a : colours.b;
                    ctx.fill();
                }
                ctx.strokeStyle = colours.link;
                ctx.lineWidth = 1;
                for (i = 0; i < particles.length; i++) {
                    p = particles[i];
                    for (j = i + 1; j < particles.length; j++) {
                        q = particles[j];
                        var lx = p.x - q.x;
                        var ly = p.y - q.y;
                        var ld = Math.sqrt(lx * lx + ly * ly);
                        if (ld < LINK_DIST) {
                            ctx.globalAlpha = 1 - ld / LINK_DIST;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(q.x, q.y);
                            ctx.stroke();
                        }
                    }
                }
                ctx.globalAlpha = 1;
                rafId = window.requestAnimationFrame(frame);
            };

            var start = function () {
                if (running) return;
                running = true;
                canvas.classList.add("is-live");
                rafId = window.requestAnimationFrame(frame);
            };
            var stop = function () {
                running = false;
                if (rafId) window.cancelAnimationFrame(rafId);
                rafId = null;
            };

            readColours();
            build();

            if ("IntersectionObserver" in window) {
                var io = new IntersectionObserver(function (entries) {
                    entries.forEach(function (e) {
                        heroInView = e.isIntersecting;
                        if (heroInView && !document.hidden) start();
                        else stop();
                    });
                }, { threshold: 0 });
                io.observe(hero);
            } else {
                start();
            }

            hero.addEventListener("pointermove", function (e) {
                var rect = hero.getBoundingClientRect();
                pointer.x = e.clientX - rect.left;
                pointer.y = e.clientY - rect.top;
                pointer.active = true;
            });
            hero.addEventListener("pointerleave", function () {
                pointer.active = false;
                pointer.x = -9999;
                pointer.y = -9999;
            });

            document.addEventListener("visibilitychange", function () {
                if (document.hidden) stop();
                else if (heroInView) start();
            });

            var resizeTimer = null;
            window.addEventListener("resize", function () {
                if (resizeTimer) window.clearTimeout(resizeTimer);
                resizeTimer = window.setTimeout(function () {
                    dpr = Math.min(window.devicePixelRatio || 1, 2);
                    build();
                }, 200);
            });

            var systemScheme = window.matchMedia("(prefers-color-scheme: dark)");
            if (systemScheme.addEventListener) {
                systemScheme.addEventListener("change", readColours);
            }
            if ("MutationObserver" in window) {
                var mo = new MutationObserver(readColours);
                mo.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ["data-theme"]
                });
            }
        });
    }
}());
